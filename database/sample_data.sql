INSERT INTO users (name, email, password, role)
VALUES
    ('Fresh Basket Retail', 'retailer1@example.com', '$2b$12$examplehashedpassword', 'retailer'),
    ('Urban Pantry Retail', 'retailer2@example.com', '$2b$12$examplehashedpassword', 'retailer'),
    ('Priya Sharma', 'customer1@example.com', '$2b$12$examplehashedpassword', 'customer')
ON CONFLICT (email) DO NOTHING;

INSERT INTO stores (retailer_id, store_name, address, latitude, longitude)
SELECT id, 'Fresh Basket', '12 MG Road, Bengaluru', 12.9756, 77.6050
FROM users WHERE email = 'retailer1@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO stores (retailer_id, store_name, address, latitude, longitude)
SELECT id, 'Urban Pantry', '18 Indiranagar, Bengaluru', 12.9784, 77.6408
FROM users WHERE email = 'retailer2@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO products (retailer_id, name, category, original_price, discount, final_price, expiry_time, quantity, image_url)
SELECT id, 'Whole Wheat Bread', 'Bakery', 60, 35, 39, NOW() + INTERVAL '6 hour', 12, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80'
FROM users WHERE email = 'retailer1@example.com';

INSERT INTO products (retailer_id, name, category, original_price, discount, final_price, expiry_time, quantity, image_url)
SELECT id, 'Greek Yogurt Pack', 'Dairy', 120, 45, 66, NOW() + INTERVAL '4 hour', 20, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80'
FROM users WHERE email = 'retailer2@example.com';

INSERT INTO deals (product_id, score, views, clicks)
SELECT id, 82.4, 34, 11 FROM products WHERE name = 'Whole Wheat Bread'
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO deals (product_id, score, views, clicks)
SELECT id, 91.2, 52, 24 FROM products WHERE name = 'Greek Yogurt Pack'
ON CONFLICT (product_id) DO NOTHING;

