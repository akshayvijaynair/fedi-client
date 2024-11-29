import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {FollowRequest, FriendRequest,} from '../models/FriendRequest';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class ConnectionProfileService {
  friendRequests!: FollowRequest[];

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  sendFollowRequest(actor: string, object: string): Observable<any> {
    return this.http.post<any>(
      `${environment.baseApiUrl}/users/${object}/inbox`,
      {
        "@context": "https://www.w3.org/ns/activitystreams",
        "type": "Follow",
        "actor": `https://example.com/users/${actor}`,        // Follower's actor URL
        "object": `https://example.com/users/${object}`,      // Followee's actor URL
        "summary": `User ${actor} wants to follow ${object}`
      }
    )
  }

  getFriendRequests(): Observable<FollowRequest[]> {
    return this.http.get<any>(
      `${environment.baseApiUrl}/users/testuser3@test.com/inbox`
    ).pipe(
      map((response) => {
        // Transform each API response item into a FriendRequest
        return response.map((item: any) => this.mapApiResponseToFriendRequest(item));
      })
    );
  }

  private mapApiResponseToFriendRequest(apiResponse: any): FollowRequest {
    return {
      //id: this.generateUniqueIdFromApi(apiResponse.actor, apiResponse.object), // Generate or use API id
      creatorId: this.extractUserIdFromUrl(apiResponse.actor), // Parse actor URL to creatorId
      receiverId: this.extractUserIdFromUrl(apiResponse.object), // Parse object URL to receiverId
      status: apiResponse.status, // Map status
      summary: apiResponse.summary, // Summary
      createdAt: apiResponse.createdAt ? this.parseDateArray(apiResponse.createdAt) : undefined,
      updatedAt: apiResponse.updatedAt ? this.parseDateArray(apiResponse.updatedAt) : undefined,
    };
  }

  private extractUserIdFromUrl(url: string): number {
    const match = url.match(/users\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private parseDateArray(dateArray: number[]): Date {
    const [year, month, day, hour, minute, second, nanoseconds] = dateArray;
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second, nanoseconds / 1000000));
  }
/*
  private generateUniqueIdFromApi(actor: string, object: string): number {
    // Use a combination of actor and object for a unique ID (or use API-provided ID if available)
    return `${actor}-${object}`.hashCode(); // Replace hashCode with a real implementation
  }*/

  respondToFriendRequest(
    id: number,
    statusResponse: 'accepted' | 'declined'
  ): Observable<FriendRequest> {
    return this.http.put<FriendRequest>(
      `${environment.baseApiUrl}/users/friend-request/response/${id}`,
      { status: statusResponse },
      this.httpOptions
    );
  }
}
