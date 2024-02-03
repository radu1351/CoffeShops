export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Review{
  id: string,
  data: ReviewData
}

export interface CoffeShop{
  id: string,
  data: CoffeShopData
}

export interface CoffeShopData{
  name: string,
    adress: string,
    atmosphere: string,
    menu: string,
    reviews?: []
}

export interface ReviewData{
  userId: string,
  message: string,
  rating: number
}
