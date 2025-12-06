export interface GroceryItem {
  name: string;
  quantity: number;
  checked: boolean;
}

export interface GrocerySection {
  name: string;
  items: GroceryItem[];
}

export interface GroceryList {
  id?: string;
  title: string;
  sections: GrocerySection[];
}
