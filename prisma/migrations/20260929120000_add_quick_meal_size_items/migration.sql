INSERT INTO "MenuItem" (
    "name",
    "description",
    "price",
    "category",
    "image",
    "popular",
    "available",
    "createdAt",
    "updatedAt"
)
SELECT
    quick_meal."name",
    quick_meal."description",
    quick_meal."price",
    'Quick Meals',
    '/images/food/soup.jpg',
    false,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    VALUES
        ('Soup - Quarter Liter', 'Fresh soup packed in a quarter-liter portion.', 3500),
        ('Soup - Half Liter', 'Fresh soup packed in a half-liter portion.', 4500),
        ('Soup - 1 Liter', 'Fresh soup packed in a one-liter portion.', 8500),
        ('Soup - 1 Pot', 'A family-size pot of fresh soup.', 15000)
) AS quick_meal("name", "description", "price")
WHERE NOT EXISTS (
    SELECT 1
    FROM "MenuItem" existing_item
    WHERE LOWER(TRIM(existing_item."name")) = LOWER(quick_meal."name")
);
