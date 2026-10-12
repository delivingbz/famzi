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
    drink."name",
    drink."description",
    drink."price",
    'Drinks',
    '',
    false,
    true,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('Holland Big', 'Refreshing Holland drink, big size.', 2000),
    ('Holland Medium', 'Refreshing Holland drink, medium size.', 1500),
    ('Holland Small', 'Refreshing Holland drink, small size.', 1000),
    ('Chi Exotic Big', 'Refreshing Chi Exotic drink, big size.', 2000),
    ('Chi Exotic Medium', 'Refreshing Chi Exotic drink, medium size.', 1500),
    ('Chi Exotic Small', 'Refreshing Chi Exotic drink, small size.', 1000),
    ('V-Smart', 'V-Smart drink.', 2500),
    ('Viju Wheat', 'Viju Wheat drink.', 1500),
    ('N-Yo', 'N-Yo drink.', 700),
    ('N-Milk', 'N-Milk drink.', 650),
    ('Viju Milk', 'Viju Milk drink.', 800),
    ('Bottled Water', 'Chilled bottled water.', 300)
) AS drink("name", "description", "price")
WHERE NOT EXISTS (
    SELECT 1
    FROM "MenuItem" AS existing
    WHERE existing."name" = drink."name"
      AND existing."category" = 'Drinks'
);
