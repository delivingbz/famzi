export const MENU_CATEGORIES = [
  "Rice Meals",
  "Nigerian Rice Dishes",
  "Continental Rice",
  "Soups",
  "Swallow & Soups",
  "Stews & Sauces",
  "Yam & Plantain",
  "Beans & Legumes",
  "Nigerian Breakfast",
  "Small Chops & Snacks",
  "Suya & Nigerian Grills",
  "Pasta & Noodles",
  "Italian Dishes",
  "Chinese Dishes",
  "Indian Dishes",
  "Mexican Dishes",
  "Mediterranean Dishes",
  "Middle Eastern Dishes",
  "Caribbean Dishes",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "Shawarma",
  "Shawarma & Wraps",
  "Grills & BBQ",
  "Seafood",
  "Salads",
  "Appetizers",
  "Proteins & Sides",
  "Sides",
  "Quick Meals",
  "Desserts",
  "Drinks",
] as const;

const categoryAliases: Record<string, string> = {
  "rice meal": "Rice Meals",
  "sauce": "Stews & Sauces",
};

function categoryKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function getCanonicalMenuCategory(value: string) {
  const key = categoryKey(value);
  const alias = categoryAliases[key];
  if (alias) return alias;
  return MENU_CATEGORIES.find((category) => categoryKey(category) === key);
}

export function normalizeMenuCategory(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  return getCanonicalMenuCategory(cleaned) ?? cleaned;
}
