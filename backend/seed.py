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

        db.commit()
        print("Seed completed.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

