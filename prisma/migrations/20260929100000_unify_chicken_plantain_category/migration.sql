UPDATE "MenuItem"
SET "category" = 'Sides', "updatedAt" = CURRENT_TIMESTAMP
WHERE LOWER(TRIM("name")) IN ('chicken', 'plantain')
  AND "category" <> 'Sides';
