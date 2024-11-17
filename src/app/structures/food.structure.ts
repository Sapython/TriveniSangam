export type Item = {
  itemId: string;
  itemName: string;
  unit: string;
  quantity: number;
  rate: number;
};

type Duration = {
  number: number;
  unit: 'minutes' | 'hours' | 'days';
}

export type Dish = {
  dishId: string;
  name: string;
  ingredients: Item[];
  images: string[];
  type: string;
  flavourPalette: string;
  startMonth:
    | 'January'
    | 'February'
    | 'March'
    | 'April'
    | 'May'
    | 'June'
    | 'July'
    | 'August'
    | 'September'
    | 'October'
    | 'November'
    | 'December';
  endMonth:
    | 'January'
    | 'February'
    | 'March'
    | 'April'
    | 'May'
    | 'June'
    | 'July'
    | 'August'
    | 'September'
    | 'October'
    | 'November'
    | 'December';
  description: string;
  cookingCost: number;
  sellingCost: number;
  cookingInstructions: string[];
  servingInstructions: string[];
  preparationTime: Duration;
  cookingTime: Duration;
  servingTime: Duration;
  shelfLife: Duration;
  energyConsumption: string;
};
