from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Deal, Product, Store, User, UserRole
from app.security import hash_password
from app.utils import calculate_final_price


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        retailer = db.scalar(select(User).where(User.email == "retailer@example.com"))
        if retailer is None:
            retailer = User(
                name="Green Market",
                email="retailer@example.com",
                password=hash_password("password123"),
                role=UserRole.retailer,
            )
            db.add(retailer)
            db.flush()
            db.add(
                Store(
                    retailer_id=retailer.id,
                    store_name="Green Market",
                    address="42 Residency Road, Bengaluru",
                    latitude=12.9719,
                    longitude=77.6079,
                )
            )

        customer = db.scalar(select(User).where(User.email == "customer@example.com"))
        if customer is None:
            db.add(
                User(
                    name="Demo Customer",
                    email="customer@example.com",
                    password=hash_password("password123"),
                    role=UserRole.customer,
                )
            )

        existing_product = db.scalar(select(Product).where(Product.name == "Organic Salad Mix"))
        if existing_product is None:
            product = Product(
                retailer_id=retailer.id,
                name="Organic Salad Mix",
                category="Fresh Produce",
                original_price=180,
                discount=40,
                final_price=calculate_final_price(180, 40),
                expiry_time=datetime.now(timezone.utc) + timedelta(hours=8),
                quantity=14,
                image_url="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
            )
            db.add(product)
            db.flush()
            db.add(Deal(product_id=product.id, score=88.5, views=26, clicks=10))

        existing_batter = db.scalar(select(Product).where(Product.name == "Idli Dosa Batter"))
        if existing_batter is None:
            batter = Product(
                retailer_id=retailer.id,
                name="Idli Dosa Batter",
                category="Breakfast Staples",
                original_price=70,
                discount=35,
                final_price=calculate_final_price(70, 35),
                expiry_time=datetime.now(timezone.utc) + timedelta(hours=10),
                quantity=18,
                image_url=None,
            )
            db.add(batter)
            db.flush()
            db.add(Deal(product_id=batter.id, score=91.0, views=31, clicks=14))

        existing_fish = db.scalar(select(Product).where(Product.name == "Vanjaram Fish Steaks"))
        if existing_fish is None:
            fish = Product(
                retailer_id=retailer.id,
                name="Vanjaram Fish Steaks",
                category="Seafood",
                original_price=320,
                discount=30,
                final_price=calculate_final_price(320, 30),
                expiry_time=datetime.now(timezone.utc) + timedelta(hours=5),
                quantity=6,
                image_url=None,
                description="Fresh seafood flash sale for evening shoppers.",
                tags=["non-veg", "fish", "seafood"],
            )
            db.add(fish)
            db.flush()
            db.add(Deal(product_id=fish.id, score=84.0, views=18, clicks=8))

        db.commit()
        print("Seed completed.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
