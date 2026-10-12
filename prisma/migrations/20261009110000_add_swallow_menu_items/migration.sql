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
    item."name",
    item."description",
    item."price",
    'Swallow',
    '',
    false,
    true,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('Eba', 'Freshly prepared eba.', 500),
    ('Fufu', 'Freshly prepared fufu.', 500),
    ('Pounded Yam', 'Freshly prepared pounded yam.', 1000),
    ('Semo', 'Freshly prepared semo.', 700)
) AS item("name", "description", "price")
WHERE NOT EXISTS (
    SELECT 1
    FROM "MenuItem" AS existing
    WHERE existing."name" = item."name"
      AND existing."category" = 'Swallow'
);