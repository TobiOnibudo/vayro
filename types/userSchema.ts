import { Condition, Category } from "./priceSuggestionFormSchema";

export interface LoginUser {
  email: string;
  password: string;
}
export interface SignUpUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  address: string;
  phone: string; //string?
}


export interface LoggedInUser{
  uid: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  phone: string; 
  createdAt: string;
}

export interface UserUpload {
  title: string;
  price: number;
  address: string;
  city: string;
  postal: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  type: string;
  condition: Condition;
  category: Category;
  boughtInYear: number;
}

