import { Post } from 'src/app/home/models/Post';

export type Role = 'admin' | 'premium' | 'user';

export interface User {
  id?: string;  // Server-generated or client-generated URI
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  name?: string;
  type?: "Person";  // Standard type for individual users
  inbox?: string;   // URL for the user's inbox
  outbox?: string;  // URL for the user's outbox
  publicKey?: {
    id: string;  // URI for the public key
    owner: string;  // ID of the user who owns this key
    publicKeyPem: string;  // PEM-encoded public key
  };
  followers?: string;  // URL to the followers collection
  following?: string;  // URL to the following collection
  url?: string;  // URL to the user's profile
  icon?: {
    type: 'Image';
    mediaType: string; // e.g., 'image/png' or 'image/jpeg'
    url: string;       // URL to the user's profile image
  };
}
