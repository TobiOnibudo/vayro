// TODO: change user schema when implementing auth
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
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  phone: string; 
  createdAt: string;
}

