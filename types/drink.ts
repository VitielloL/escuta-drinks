export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  observation?: string;
}

export interface Drink {
  id: string;
  image?: string;
  name: string;
  category: string;
  garnish: string;
  method: string;
  glass: string;
  ingredients: Ingredient[];
  preparation: string[];
  tags?: string[];
}