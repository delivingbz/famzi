// FAMZI FILE GUIDE: Seed data for the initial menu and idempotent database setup.
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const menuItems = [
  {
    id: 1,
    name: "Jollof Rice",
    description: "Deliciously prepared jollof rice served fresh.",
    price: 1500,
    category: "Rice Meals",
    image: "/images/food/jollof-rice.jpg",
    popular: true,
    available: true,
  },
  {
    id: 2,
    name: "Fried Rice",
    description: "Freshly prepared fried rice with rich flavour.",
    price: 1700,
    category: "Rice Meals",
    image: "/images/food/fried-rice.jpg",
    popular: true,
    available: true,
  },
  {
    id: 3,
    name: "Mishai",
    description: "The signature Dfamiliz sandwich experience.",
    price: 1500,
    category: "Sandwiches",
    image: "/images/food/mishai.jpg",
    popular: true,
    available: true,
  },
  {
    id: 4,
    name: "Shawarma",
    description: "Freshly prepared shawarma packed with flavour.",
    price: 2800,
    category: "Shawarma",
    image: "/images/food/shawarma.jpg",
    popular: true,
    available: true,
  },
  {
    id: 5,
    name: "Spaghetti",
    description: "Tasty spaghetti prepared fresh for your order.",
    price: 1500,
    category: "Rice Meals",
    image: "/images/food/spaghetti.jpg",
    popular: false,
    available: true,
  },
  {
    id: 6,
    name: "Chicken",
    description: "Tender, well-seasoned chicken prepared fresh.",
    price: 1500,
    category: "Sides",
    image: "/images/food/chicken.jpg",
    popular: false,
    available: true,
  },
  {
    id: 7,
    name: "Ice Cream",
    description: "A cool and refreshing treat after your meal.",
    price: 1000,
    category: "Desserts",
    image: "/images/food/ice-cream.jpg",
    popular: false,
    available: true,
  },
  {
    id: 8,
    name: "Cold Drink",
    description: "A refreshing drink to complete your meal.",
    price: 700,
    category: "Drinks",
    image: "/images/food/drink.jpg",
    popular: false,
    available: true,
  },
];

async function main() {
  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: {
        id: item.id,
      },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        popular: item.popular,
        available: item.available,
      },
      create: item,
    });
  }

  console.log("FAMZI menu seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Failed to seed menu:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
