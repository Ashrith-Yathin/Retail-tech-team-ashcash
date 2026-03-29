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
    DealResponse,
    LoginRequest,
    MessageResponse,
    ProductAnalytics,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
    RankDealsRequest,
    RegisterRequest,
    TokenResponse,
)
from app.security import create_access_token, hash_password, verify_password
from app.utils import calculate_final_price, conversion_rate, ensure_utc, haversine_distance


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
        category=product.category,
        original_price=float(product.original_price),
        discount=product.discount,
        final_price=float(product.final_price),
        expiry_time=product.expiry_time,
        quantity=product.quantity,
        image_url=product.image_url,
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
        category=payload.category,
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
    return product


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
        item = ProductResponse.model_validate(product).model_dump()
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
    db.commit()
    return {"active_deals": active, "expired_deals": expired, "analytics": analytics}


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
        setattr(product, field, ensure_utc(value) if field == "expiry_time" and value is not None else value)

    if payload.original_price is not None or payload.discount is not None:
        original_price = payload.original_price if payload.original_price is not None else float(product.original_price)
        discount = payload.discount if payload.discount is not None else product.discount
        product.final_price = calculate_final_price(original_price, discount)

    store = _get_or_create_store(db, user.id, payload)
    _refresh_deal_score(db, product, store)
    db.commit()
    db.refresh(product)
    return product


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

    if sort_by == "nearest":
        results.sort(key=lambda item: item.distance_km)
    elif sort_by == "highest_discount":
        results.sort(key=lambda item: item.discount, reverse=True)
    elif sort_by == "expiring_soon":
        results.sort(key=lambda item: item.expiry_time)
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


@app.post("/deal/{deal_id}/click", response_model=MessageResponse)
def track_click(deal_id: int, db: Session = Depends(get_db)):
    deal = db.scalar(select(Deal).where(Deal.id == deal_id))
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
    deal.clicks += 1
    db.commit()
    return MessageResponse(message="Click tracked")


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
