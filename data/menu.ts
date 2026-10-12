// FAMZI FILE GUIDE: Shared TypeScript shape for menu items returned by the menu API.
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
  available: boolean;
};

