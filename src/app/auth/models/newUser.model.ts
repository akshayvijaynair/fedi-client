export interface NewUser {
  id?: string;  // Server-generated or client-generated URI
  name:string;
  email: string;
  password: string;
}
