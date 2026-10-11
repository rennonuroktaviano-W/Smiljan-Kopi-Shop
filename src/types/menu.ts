export type MenuCategory = "coffee" | "non-coffee" | "food";

export interface MenuCategoryInfo {
  value: MenuCategory;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  imageAlt: string;
  featured?: boolean;
  available: boolean;
}

export const menuCategories: MenuCategoryInfo[] = [
  { value: "coffee", label: "Coffee" },
  { value: "non-coffee", label: "Non-Coffee" },
  { value: "food", label: "Food" },
];

export function isMenuCategory(value: string): value is MenuCategory {
  return menuCategories.some((category) => category.value === value);
}