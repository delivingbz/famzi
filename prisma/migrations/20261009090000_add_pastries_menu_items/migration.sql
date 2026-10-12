INSERT INTO "MenuItem" (
    "name",
    "description",
    "price",
    "category",
    "image",
    "popular",
    "available",
    "updatedAt"
)
SELECT
    pastry."name",
    pastry."description",
    pastry."price",
    'Pastries',
    '',
    false,
    true,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('Meat Pie', 'Freshly baked meat pie.', 600),
    ('Chicken Pie', 'Freshly baked chicken pie.', 700),
    ('Egg Roll', 'Fresh egg roll.', 600),
    ('Hot Dog Roll', 'Fresh hot dog roll.', 500),
    ('Hamburger', 'Fresh hamburger.', 2500),
    ('Donut', 'Fresh donut.', 500),
    ('Small Pizza', 'Freshly baked small pizza.', 5000),
    ('Medium Pizza', 'Freshly baked medium pizza.', 8000),
    ('Large Pizza', 'Freshly baked large pizza.', 15000),
    ('Small Cake', 'Fresh small cake.', 500),
    ('Medium Cake', 'Fresh medium cake.', 1500)
) AS pastry("name", "description", "price")
WHERE NOT EXISTS (
    SELECT 1
    FROM "MenuItem" AS existing
    WHERE existing."name" = pastry."name"
      AND existing."category" = 'Pastries'
);