export interface NewUser {
  id?: string;  // Server-generated or client-generated URI
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
