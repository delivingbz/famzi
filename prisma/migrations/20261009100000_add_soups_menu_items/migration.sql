UPDATE "MenuItem"
SET "category" = 'Swallow', "updatedAt" = CURRENT_TIMESTAMP
WHERE "category" = 'Swallow & Soups';

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
    soup."name",
    soup."description",
    soup."price",
    'Soups',
    '',
    false,
    true,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('Okro Soup', 'Freshly prepared okro soup.', 1500),
    ('Egusi Soup', 'Freshly prepared egusi soup.', 1500),
    ('Vegetable Soup', 'Freshly prepared vegetable soup.', 1500),
    ('Oha Soup', 'Freshly prepared oha soup.', 1500),
    ('Bitter Leaf Soup', 'Freshly prepared bitter leaf soup.', 1500),
    ('Ogbono Soup', 'Freshly prepared ogbono soup.', 1500)
) AS soup("name", "description", "price")
WHERE NOT EXISTS (
    SELECT 1
    FROM "MenuItem" AS existing
    WHERE existing."name" = soup."name"
      AND existing."category" = 'Soups'
);