# Hyperlocal Deal Discovery Platform

Hyperlocal Deal Discovery Platform is a full-stack web application that helps local retailers publish overstocked or near-expiry products and lets nearby customers discover live discounts in real time. The project includes a Next.js frontend, a FastAPI backend, PostgreSQL schema, and a separate machine learning module for smart deal ranking.

## Project Structure

```text
frontend/   Next.js + Tailwind CSS web app
backend/    FastAPI REST API with JWT auth and PostgreSQL integration
ml/         Ranking model training and prediction scripts
database/   PostgreSQL schema and sample SQL data
```

## Features

- Retailer authentication with JWT and bcrypt password hashing
- Retailer dashboard for adding, viewing, and deleting products
- Auto-calculated final price from original price and discount percentage
- Active vs expired deal separation
- Customer deal discovery with guest browsing
- Geolocation-based nearby deals within a 5 km radius using the Haversine formula
- Filters for category, distance, discount, and expiry urgency
- Sorting by nearest, highest discount, expiring soon, and smart ranking
- Featured deals section and countdown timers
- Deal analytics with views, clicks, and conversion rate
- OpenStreetMap store map embed and Google Maps directions handoff
- ML-ready ranking flow with rule-based fallback and model inference

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, JWT, bcrypt
- Database: PostgreSQL
- Machine Learning: Python, scikit-learn, joblib
- Maps: Browser Geolocation API, OpenStreetMap embed, Google Maps directions link
- Deployment targets: Vercel, Render or Railway, Supabase PostgreSQL

## Backend Setup

1. Create a PostgreSQL database named `hyperlocal_deals`.
2. Copy [backend/.env.example](/Users/ashrithyathin/Downloads/Vashist 3/backend/.env.example) to `backend/.env` and update values.
3. Create a virtual environment and install dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

4. Start the API:

```bash
uvicorn app.main:app --reload
```

5. Optional seed data:

```bash
python seed.py
```

API base URL defaults to `http://localhost:8000`.

## Frontend Setup

1. Copy [frontend/.env.example](/Users/ashrithyathin/Downloads/Vashist 3/frontend/.env.example) to `frontend/.env.local`.
2. Install dependencies and run the app:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## ML Setup

1. Install ML dependencies:

```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Train the ranking model:

```bash
python train_model.py
```

This generates `ml/model.pkl`, which the backend uses automatically if present. If the model is missing, the backend falls back to the rule-based ranking formula:

```text
score =
(0.4 * discount) +
(0.3 * expiry_urgency) +
(0.2 * distance_score) +
(0.1 * popularity)
```

3. Run a manual prediction:

```bash
python predict.py '{"distance":1.2,"discount":40,"expiry_urgency":80,"distance_score":76,"popularity":45,"category_relevance":1,"time_of_day":18}'
```

## Database

- PostgreSQL schema: [database/schema.sql](/Users/ashrithyathin/Downloads/Vashist 3/database/schema.sql)
- Sample SQL data: [database/sample_data.sql](/Users/ashrithyathin/Downloads/Vashist 3/database/sample_data.sql)

## Core API Endpoints

### Auth

- `POST /register`
- `POST /login`

### Retailer

- `POST /add-product`
- `GET /my-products`
- `PUT /edit-product/{product_id}`
- `DELETE /delete-product/{product_id}`

### Customer

- `GET /nearby-deals`
- `GET /deal/{deal_id}`
- `POST /deal/{deal_id}/click`

### ML

- `POST /rank-deals`

## Deployment Notes

### Frontend on Vercel

- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed FastAPI backend URL.
- Add image host allowances in [frontend/next.config.ts](/Users/ashrithyathin/Downloads/Vashist 3/frontend/next.config.ts).

### Backend on Render or Railway

- Use the `backend/requirements.txt` install command.
- Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- Point `DATABASE_URL` to Supabase or managed PostgreSQL.

## Production Readiness Checklist

- Add Alembic migrations before long-term production use
- Replace direct image URLs with object storage uploads
- Add refresh tokens and password reset flow if needed
- Add background scheduling or cron for aggressive expired-deal cleanup
- Add observability and rate limiting for public endpoints

