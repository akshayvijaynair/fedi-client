export type FriendRequest_Status =
  | 'pending'
  | 'accepted'
  | 'declined'

export interface FriendRequestStatus {
  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id: number;
  creatorId: number;
  receiverId: number;
  status?: FriendRequest_Status;
  fullImagePath?: string;
}

export interface FollowRequest {
  //id: number;
  creatorId: number; // Maps to "actor" (parsed)
  receiverId: number; // Maps to "object" (parsed)
  status?: FriendRequest_Status; // Maps to "status"
  fullImagePath?: string; // Can be set as needed
  createdAt?: Date; // Parsed from "createdAt" array
  updatedAt?: Date; // Parsed from "updatedAt" array
  summary?: string; // Maps to "summary"
  type?: string; // Maps to "type" (e.g., "Follow")
}
