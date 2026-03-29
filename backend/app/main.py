from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import Base, engine, get_db
from app.deps import get_current_user, require_role
from app.ml_service import build_feature_row, rank_feature_rows
from app.models import Deal, Product, Store, User, UserRole
from app.schemas import (
    CategoryInsight,
    DashboardSummary,
    DealResponse,
    ImpactSummary,
    LoginRequest,
    MessageResponse,
    ProductAnalytics,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
    RankDealsRequest,
    RegisterRequest,
    ReservationRequest,
    SearchSuggestion,
    TokenResponse,
)
from app.security import create_access_token, hash_password, verify_password
from app.utils import (
    availability_label,
    calculate_final_price,
    conversion_rate,
    ensure_utc,
    haversine_distance,
    parse_tags,
    popularity_label,
    ranking_reasons,
    savings_amount,
    serialize_tags,
    urgency_label,
    waste_prevented_kg,
)


settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hyperlocal Deal Discovery Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _serialize_deal(deal: Deal, store: Store, distance_km: float) -> DealResponse:
    product = deal.product
    tag_list = parse_tags(product.tags)
    return DealResponse(
        id=deal.id,
        product_id=product.id,
        score=round(deal.score, 2),
        views=deal.views,
        clicks=deal.clicks,
        distance_km=round(distance_km, 2),
        conversion_rate=conversion_rate(deal.views, deal.clicks),
        store_name=store.store_name,
        store_address=store.address,
        latitude=store.latitude,
        longitude=store.longitude,
        product_name=product.name,
        brand=product.brand,
        category=product.category,
        description=product.description,
        tags=tag_list,
        original_price=float(product.original_price),
        discount=product.discount,
        final_price=float(product.final_price),
        savings_amount=savings_amount(float(product.original_price), float(product.final_price)),
        expiry_time=product.expiry_time,
        quantity=product.quantity,
        image_url=product.image_url,
        urgency_label=urgency_label(product.expiry_time),
        popularity_label=popularity_label(deal.views, deal.clicks),
        availability_label=availability_label(product.quantity),
        waste_prevented_kg=waste_prevented_kg(product.quantity),
        ranking_reasons=ranking_reasons(
            discount=product.discount,
            distance_km=distance_km,
            expiry_time=product.expiry_time,
            views=deal.views,
            clicks=deal.clicks,
        ),
    )


def _get_or_create_store(db: Session, retailer_id: int, payload: ProductCreate | ProductUpdate) -> Store:
    store = db.scalar(select(Store).where(Store.retailer_id == retailer_id))
    if store is None:
        store = Store(
            retailer_id=retailer_id,
            store_name=payload.store_name,
            address=payload.store_address,
            latitude=payload.latitude,
            longitude=payload.longitude,
        )
        db.add(store)
        db.flush()
    else:
        if payload.store_name is not None:
            store.store_name = payload.store_name
        if payload.store_address is not None:
            store.address = payload.store_address
        if payload.latitude is not None:
            store.latitude = payload.latitude
        if payload.longitude is not None:
            store.longitude = payload.longitude
    return store


def _refresh_deal_score(db: Session, product: Product, store: Store, preferred_category: str | None = None) -> Deal:
    deal = product.deal
    if deal is None:
        deal = Deal(product_id=product.id, views=0, clicks=0, score=0)
        db.add(deal)
        db.flush()

    popularity = conversion_rate(deal.views, deal.clicks)
    feature_row = build_feature_row(
        distance_km=0,
        discount=product.discount,
        expiry_time=product.expiry_time,
        popularity=popularity,
        category=product.category,
        preferred_category=preferred_category,
        time_of_day=datetime.now().hour,
    )
    deal.score = rank_feature_rows([feature_row])[0]
    return deal


def _serialize_product(product: Product) -> ProductResponse:
    return ProductResponse(
        id=product.id,
        retailer_id=product.retailer_id,
        name=product.name,
        brand=product.brand,
        category=product.category,
        description=product.description,
        tags=parse_tags(product.tags),
        is_featured=product.is_featured,
        original_price=float(product.original_price),
        discount=product.discount,
        final_price=float(product.final_price),
        expiry_time=product.expiry_time,
        quantity=product.quantity,
        image_url=product.image_url,
        created_at=product.created_at,
    )


def _matches_query(product: Product, store: Store | None, query: str | None) -> bool:
    if not query:
        return True
    needle = query.strip().lower()
    if not needle:
        return True
    candidates = [
        product.name,
        product.category,
        product.brand or "",
        product.description or "",
        product.tags or "",
        store.store_name if store else "",
        store.address if store else "",
    ]
    return any(needle in candidate.lower() for candidate in candidates)


def _active_product_filter(product: Product) -> bool:
    return product.expiry_time > datetime.now(timezone.utc) and product.quantity > 0


def _cleanup_expired_deals(db: Session) -> None:
    expired_products = db.scalars(select(Product).where(Product.expiry_time <= datetime.now(timezone.utc))).all()
    for product in expired_products:
        if product.deal:
            product.deal.score = 0


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.scalar(select(User).where(User.email == payload.email))
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.flush()

    if payload.role == UserRole.retailer:
        if (
            payload.store_name is None
            or payload.store_address is None
            or payload.latitude is None
            or payload.longitude is None
        ):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Retailers must provide store details")
        db.add(
            Store(
                retailer_id=user.id,
                store_name=payload.store_name,
                address=payload.store_address,
                latitude=payload.latitude,
                longitude=payload.longitude,
            )
        )

    db.commit()
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, role=user.role, user_id=user.id, name=user.name)


@app.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, role=user.role, user_id=user.id, name=user.name)


@app.post("/add-product", response_model=ProductResponse)
def add_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.retailer)),
):
    store = _get_or_create_store(db, user.id, payload)
    product = Product(
        retailer_id=user.id,
        name=payload.name,
        brand=payload.brand,
        category=payload.category,
        description=payload.description,
        tags=serialize_tags(payload.tags),
        is_featured=payload.is_featured,
        original_price=payload.original_price,
        discount=payload.discount,
        final_price=calculate_final_price(payload.original_price, payload.discount),
        expiry_time=ensure_utc(payload.expiry_time),
        quantity=payload.quantity,
        image_url=payload.image_url,
    )
    db.add(product)
    db.flush()
    _refresh_deal_score(db, product, store)
    db.commit()
    db.refresh(product)
    return _serialize_product(product)


@app.get("/my-products")
def my_products(
    include_expired: bool = Query(default=True),
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.retailer)),
):
    _cleanup_expired_deals(db)
    products = db.scalars(select(Product).where(Product.retailer_id == user.id).order_by(Product.created_at.desc())).all()
    store = db.scalar(select(Store).where(Store.retailer_id == user.id))
    active, expired, analytics = [], [], []
    for product in products:
        if product.deal is None and store:
            _refresh_deal_score(db, product, store)
        item = _serialize_product(product).model_dump()
        is_active = _active_product_filter(product)
        if is_active:
            active.append(item)
        elif include_expired:
            expired.append(item)
        deal = product.deal
        analytics.append(
            ProductAnalytics(
                product_id=product.id,
                product_name=product.name,
                views=deal.views if deal else 0,
                clicks=deal.clicks if deal else 0,
                conversion_rate=conversion_rate(deal.views if deal else 0, deal.clicks if deal else 0),
                status="active" if _active_product_filter(product) else "expired",
            )
        )
    active_analytics = [item for item in analytics if item.status == "active"]
    summary = DashboardSummary(
        active_count=len(active),
        expired_count=len(expired),
        total_views=sum(item.views for item in analytics),
        total_clicks=sum(item.clicks for item in analytics),
        average_conversion_rate=round(
            sum(item.conversion_rate for item in active_analytics) / len(active_analytics), 2
        )
        if active_analytics
        else 0,
        expiring_soon_count=sum(
            1
            for product in products
            if _active_product_filter(product)
            and (ensure_utc(product.expiry_time) - datetime.now(timezone.utc)).total_seconds() / 3600 <= 12
        ),
        low_stock_count=sum(1 for product in products if _active_product_filter(product) and product.quantity <= 5),
        top_performing_product=max(analytics, key=lambda item: item.clicks).product_name if analytics else None,
    )
    db.commit()
    return {"active_deals": active, "expired_deals": expired, "analytics": analytics, "summary": summary}


@app.put("/edit-product/{product_id}", response_model=ProductResponse)
def edit_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.retailer)),
):
    product = db.scalar(select(Product).where(Product.id == product_id, Product.retailer_id == user.id))
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        if field in {"store_name", "store_address", "latitude", "longitude"}:
            continue
        if field == "tags":
            value = serialize_tags(value)
        setattr(product, field, ensure_utc(value) if field == "expiry_time" and value is not None else value)

    if payload.original_price is not None or payload.discount is not None:
        original_price = payload.original_price if payload.original_price is not None else float(product.original_price)
        discount = payload.discount if payload.discount is not None else product.discount
        product.final_price = calculate_final_price(original_price, discount)

    store = _get_or_create_store(db, user.id, payload)
    _refresh_deal_score(db, product, store)
    db.commit()
    db.refresh(product)
    return _serialize_product(product)


@app.delete("/delete-product/{product_id}", response_model=MessageResponse)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.retailer)),
):
    product = db.scalar(select(Product).where(Product.id == product_id, Product.retailer_id == user.id))
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return MessageResponse(message="Product deleted successfully")


@app.get("/nearby-deals", response_model=list[DealResponse])
def nearby_deals(
    latitude: float,
    longitude: float,
    radius_km: float = 5,
    category: str | None = None,
    min_discount: float | None = None,
    max_distance: float | None = None,
    expires_before_hours: int | None = None,
    q: str | None = None,
    sort_by: str = "smart",
    preferred_category: str | None = None,
    db: Session = Depends(get_db),
):
    _cleanup_expired_deals(db)
    now = datetime.now(timezone.utc)
    products = db.scalars(select(Product).where(Product.expiry_time > now, Product.quantity > 0)).all()
    stores_by_retailer = {
        store.retailer_id: store for store in db.scalars(select(Store)).all()
    }

    ranked_payload: list[tuple[Deal, Store, float, DealResponse, dict]] = []
    for product in products:
        if category and product.category.lower() != category.lower():
            continue
        if not _matches_query(product, stores_by_retailer.get(product.retailer_id), q):
            continue
        if min_discount is not None and product.discount < min_discount:
            continue
        if expires_before_hours is not None:
            hours_left = (product.expiry_time - now).total_seconds() / 3600
            if hours_left > expires_before_hours:
                continue

        store = stores_by_retailer.get(product.retailer_id)
        if store is None:
            continue
        distance_km = haversine_distance(latitude, longitude, store.latitude, store.longitude)
        limit = max_distance if max_distance is not None else radius_km
        if distance_km > limit:
            continue

        deal = product.deal
        if deal is None:
            deal = _refresh_deal_score(db, product, store, preferred_category)

        feature_row = build_feature_row(
            distance_km=distance_km,
            discount=product.discount,
            expiry_time=product.expiry_time,
            popularity=conversion_rate(deal.views, deal.clicks),
            category=product.category,
            preferred_category=preferred_category,
            time_of_day=datetime.now().hour,
        )
        ranked_payload.append((deal, store, distance_km, _serialize_deal(deal, store, distance_km), feature_row))

    if not ranked_payload:
        return []

    scores = rank_feature_rows([entry[4] for entry in ranked_payload])
    results = []
    for (deal, store, distance_km, serialized, _), score in zip(ranked_payload, scores):
        deal.score = score
        serialized.score = score
        results.append(serialized)

    results.sort(key=lambda item: not item.is_featured)

    if sort_by == "nearest":
        results.sort(key=lambda item: item.distance_km)
    elif sort_by == "highest_discount":
        results.sort(key=lambda item: item.discount, reverse=True)
    elif sort_by == "expiring_soon":
        results.sort(key=lambda item: item.expiry_time)
    elif sort_by == "newest":
        results.sort(key=lambda item: item.expiry_time, reverse=True)
    else:
        results.sort(key=lambda item: item.score, reverse=True)

    db.commit()
    return results


@app.get("/deal/{deal_id}", response_model=DealResponse)
def deal_detail(deal_id: int, db: Session = Depends(get_db)):
    deal = db.scalar(select(Deal).where(Deal.id == deal_id))
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
    product = deal.product
    store = db.scalar(select(Store).where(Store.retailer_id == product.retailer_id))
    if store is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")
    deal.views += 1
    db.commit()
    db.refresh(deal)
    return _serialize_deal(deal, store, 0)


@app.get("/featured-deals", response_model=list[DealResponse])
def featured_deals(
    latitude: float,
    longitude: float,
    limit: int = 6,
    db: Session = Depends(get_db),
):
    deals = nearby_deals(
        latitude=latitude,
        longitude=longitude,
        radius_km=5,
        category=None,
        min_discount=20,
        max_distance=None,
        expires_before_hours=24,
        q=None,
        sort_by="smart",
        preferred_category=None,
        db=db,
    )
    return deals[:limit]


@app.get("/impact-summary", response_model=ImpactSummary)
def impact_summary(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    products = db.scalars(select(Product).where(Product.expiry_time > now, Product.quantity > 0)).all()
    stores = db.scalars(select(Store)).all()
    return ImpactSummary(
        total_active_deals=len(products),
        total_retailers=len({store.retailer_id for store in stores}),
        total_estimated_savings=round(
            sum(savings_amount(float(product.original_price), float(product.final_price)) * product.quantity for product in products),
            2,
        ),
        total_waste_prevented_kg=round(sum(waste_prevented_kg(product.quantity) for product in products), 2),
    )


@app.get("/categories", response_model=list[CategoryInsight])
def categories(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    products = db.scalars(select(Product).where(Product.expiry_time > now, Product.quantity > 0)).all()
    counts: dict[str, int] = {}
    for product in products:
        counts[product.category] = counts.get(product.category, 0) + 1
    return [CategoryInsight(name=name, count=count) for name, count in sorted(counts.items())]


@app.get("/search-suggestions", response_model=list[SearchSuggestion])
def search_suggestions(q: str, db: Session = Depends(get_db)):
    needle = q.strip().lower()
    if len(needle) < 2:
        return []

    suggestions: list[SearchSuggestion] = []
    seen: set[tuple[str, str]] = set()
    stores = db.scalars(select(Store)).all()
    products = db.scalars(select(Product)).all()

    for product in products:
        for label, suggestion_type in [
            (product.name, "product"),
            (product.category, "category"),
            (product.brand or "", "brand"),
        ]:
            if label and needle in label.lower() and (label, suggestion_type) not in seen:
                seen.add((label, suggestion_type))
                suggestions.append(SearchSuggestion(label=label, type=suggestion_type))
    for store in stores:
        if needle in store.store_name.lower() and (store.store_name, "store") not in seen:
            seen.add((store.store_name, "store"))
            suggestions.append(SearchSuggestion(label=store.store_name, type="store"))

    return suggestions[:8]


@app.post("/deal/{deal_id}/click", response_model=MessageResponse)
def track_click(deal_id: int, db: Session = Depends(get_db)):
    deal = db.scalar(select(Deal).where(Deal.id == deal_id))
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
    deal.clicks += 1
    db.commit()
    return MessageResponse(message="Click tracked")


@app.post("/deal/{deal_id}/reserve", response_model=MessageResponse)
def reserve_deal(deal_id: int, payload: ReservationRequest, db: Session = Depends(get_db)):
    deal = db.scalar(select(Deal).where(Deal.id == deal_id))
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
    product = deal.product
    if product.quantity < payload.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Requested quantity is no longer available")
    product.quantity -= payload.quantity
    deal.clicks += 1
    db.commit()
    return MessageResponse(message=f"Reserved {payload.quantity} item(s) successfully")


@app.post("/rank-deals")
def rank_deals(payload: RankDealsRequest):
    feature_rows = []
    for deal in payload.deals:
        feature_rows.append(
            build_feature_row(
                distance_km=deal["distance"],
                discount=deal["discount"],
                expiry_time=datetime.fromisoformat(deal["expiry_time"]),
                popularity=deal.get("popularity", 0),
                category=deal["category"],
                preferred_category=payload.preferred_category,
                time_of_day=payload.time_of_day if payload.time_of_day is not None else datetime.now().hour,
            )
        )
    return {"scores": rank_feature_rows(feature_rows)}
