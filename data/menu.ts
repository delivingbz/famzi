export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Jollof Rice",
    description: "Deliciously prepared jollof rice served fresh.",
    price: 1500,
    category: "Rice Meals",
    image: "/images/food/jollof-rice.jpg",
    popular: true,
  },
  {
    id: 2,
    name: "Fried Rice",
    description: "Freshly prepared fried rice with rich flavour.",
    price: 1700,
    category: "Rice Meals",
    image: "/images/food/fried-rice.jpg",
    popular: true,
  },
  {
    id: 3,
    name: "Mishai",
    description: "The signature Dfamiliz sandwich experience.",
    price: 1500,
    category: "Sandwiches",
    image: "/images/food/mishai.jpg",
    popular: true,
  },
  {
    id: 4,
    name: "Shawarma",
    description: "Freshly prepared shawarma packed with flavour.",
    price: 2800,
    category: "Shawarma",
    image: "/images/food/shawarma.jpg",
    popular: true,
  },
  {
    id: 5,
    name: "Spaghetti",
    description: "Tasty spaghetti prepared fresh for your order.",
    price: 1500,
    category: "Rice Meals",
    image: "/images/food/spaghetti.jpg",
  },
  {
    id: 6,
    name: "Chicken",
    description: "Tender, well-seasoned chicken prepared fresh.",
    price: 1500,
    category: "Sides",
    image: "/images/food/chicken.jpg",
  },
  {
    id: 7,
    name: "Ice Cream",
    description: "A cool and refreshing treat after your meal.",
    price: 1000,
    category: "Desserts",
    image: "/images/food/ice-cream.jpg",
  },
  {
    id: 8,
    name: "Cold Drink",
    description: "A refreshing drink to complete your meal.",
    price: 700,
    category: "Drinks",
    image: "/images/food/drink.jpg",
  },
];