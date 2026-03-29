from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: int
    name: str


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=6, max_length=255)
    role: UserRole
    store_name: Optional[str] = None
    store_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    role: UserRole
    created_at: datetime


class StoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    store_name: str
    address: str
    latitude: float
    longitude: float


class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    category: str
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    is_featured: bool = False
    original_price: float = Field(gt=0)
    discount: float = Field(ge=0, le=100)
    expiry_time: datetime
    quantity: int = Field(gt=0)
    image_url: Optional[str] = None
    store_name: str
    store_address: str
    latitude: float
    longitude: float


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    is_featured: Optional[bool] = None
    original_price: Optional[float] = Field(default=None, gt=0)
    discount: Optional[float] = Field(default=None, ge=0, le=100)
    expiry_time: Optional[datetime] = None
    quantity: Optional[int] = Field(default=None, gt=0)
    image_url: Optional[str] = None
    store_name: Optional[str] = None
    store_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    retailer_id: int
    name: str
    brand: Optional[str]
    category: str
    description: Optional[str]
    tags: Optional[list[str]]
    is_featured: bool
    original_price: float
    discount: float
    final_price: float
    expiry_time: datetime
    quantity: int
    image_url: Optional[str]
    created_at: datetime


class DealResponse(BaseModel):
    id: int
    product_id: int
    score: float
    views: int
    clicks: int
    distance_km: float
    conversion_rate: float
    store_name: str
    store_address: str
    latitude: float
    longitude: float
    product_name: str
    brand: Optional[str]
    category: str
    description: Optional[str]
    tags: list[str]
    original_price: float
    discount: float
    final_price: float
    savings_amount: float
    expiry_time: datetime
    quantity: int
    image_url: Optional[str]
    urgency_label: str
    popularity_label: str
    availability_label: str
    waste_prevented_kg: float
    ranking_reasons: list[str]


class ProductAnalytics(BaseModel):
    product_id: int
    product_name: str
    views: int
    clicks: int
    conversion_rate: float
    status: Literal["active", "expired"]


class DashboardSummary(BaseModel):
    active_count: int
    expired_count: int
    total_views: int
    total_clicks: int
    average_conversion_rate: float
    expiring_soon_count: int
    low_stock_count: int
    top_performing_product: Optional[str]


class CategoryInsight(BaseModel):
    name: str
    count: int


class SearchSuggestion(BaseModel):
    label: str
    type: Literal["product", "category", "store", "brand"]


class ImpactSummary(BaseModel):
    total_active_deals: int
    total_retailers: int
    total_estimated_savings: float
    total_waste_prevented_kg: float


class ReservationRequest(BaseModel):
    quantity: int = Field(default=1, gt=0, le=10)


class NearbyDealsQuery(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 5
    category: Optional[str] = None
    min_discount: Optional[float] = None
    max_distance: Optional[float] = None
    expires_before_hours: Optional[int] = None
    sort_by: Literal["nearest", "highest_discount", "expiring_soon", "smart"] = "smart"
    preferred_category: Optional[str] = None


class RankDealsRequest(BaseModel):
    latitude: float
    longitude: float
    preferred_category: Optional[str] = None
    time_of_day: Optional[int] = Field(default=None, ge=0, le=23)
    deals: list[dict]


class MessageResponse(BaseModel):
    message: str
