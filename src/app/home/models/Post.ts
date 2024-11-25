import { User } from 'src/app/auth/models/user.model';

export interface Post {
  id: string; // URI for the post
  type: 'Create'; // ActivityPub type for the activity
  body: string; // This maps to the content of the Note
  createdAt: Date; // Timestamp for when the post was created
  author: User; // Maps to the actor field in ActivityPub
  object: ActivityObject; // The object being created, typically a Note
  fullImagePath?: string; // Optional property for dynamic assignment
}

export interface ActivityObject {
  id: string; // URI for the object
  type: 'Note'; // Type of object (Note is common for posts)
  content: string; // Content of the post
  published: Date; // Timestamp for when the post was published
  attributedTo: string; // URI of the user who authored the post
  attachment?: Attachment[]; // Optional attachments for images or media
}

export interface Attachment {
  type: 'Image'; // Type of attachment (e.g., Image)
  mediaType: string; // Media type, such as 'image/png'
  url: string; // URL to the media file
  name?: string; // Optional name or description for the attachment
}
