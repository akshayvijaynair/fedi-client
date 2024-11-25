import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { environment } from 'src/environments/environment';
import { Post } from '../models/Post';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getSelectedPosts(params: any): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${environment.baseApiUrl}/feed${params}`)
      .pipe(
        tap((posts: Post[]) => {
          if (posts.length === 0) throw new Error('No posts to retrieve');
        }),
        catchError((error) => {
          console.error('Error retrieving posts:', error);
          // Return the default list in case of an error or empty response
          return of(this.getDefaultPosts());
        })
      );
  }

  private getDefaultPosts(): Post[] {
    return [
      {
        id: 'https://example.com/activities/create1',
        type: 'Create',
        body: 'Hello world! This is my first post on the fediverse.',
        createdAt: new Date('2024-11-24T08:00:00Z'),
        author: {
          id: 'https://example.com/actors/user1',
          name: 'Alice Dow',
          email: 'alice@example.com',
          type: 'Person',
          inbox: 'https://example.com/actors/user1/inbox',
          outbox: 'https://example.com/actors/user1/outbox',
          icon: {
            type: 'Image',
            mediaType: 'image/jpeg',
            url: 'https://example.com/images/user1.jpg',
          },
        },
        object: {
          id: 'https://example.com/objects/post1',
          type: 'Note',
          content: 'Hello world! This is my first post on the fediverse.',
          published: new Date('2024-11-24T08:00:00Z'),
          attributedTo: 'https://example.com/actors/user1',
          attachment: [
            {
              type: 'Image',
              mediaType: 'image/jpeg',
              url: 'https://example.com/images/post1.jpg',
              name: 'My first post image',
            },
          ],
        },
      },
      {
        id: 'https://example.com/activities/create2',
        type: 'Create',
        body: 'Today I learned about the ActivityPub protocol. It’s fascinating!',
        createdAt: new Date('2024-11-23T14:30:00Z'),
        author: {
          id: 'https://example.com/actors/user2',
          name:"Bob",
          email: 'bob@example.com',
          type: 'Person',
          inbox: 'https://example.com/actors/user2/inbox',
          outbox: 'https://example.com/actors/user2/outbox',
          icon: {
            type: 'Image',
            mediaType: 'image/jpeg',
            url: 'https://example.com/images/user2.jpg',
          },
        },
        object: {
          id: 'https://example.com/objects/post2',
          type: 'Note',
          content: 'Today I learned about the ActivityPub protocol. It’s fascinating!',
          published: new Date('2024-11-23T14:30:00Z'),
          attributedTo: 'https://example.com/actors/user2',
        },
      },
      // Add more mock posts here to reach 50
    ];
  }

  createPost(body: string) {
    return this.http
      .post<Post>(`${environment.baseApiUrl}/feed`, { body }, this.httpOptions)
      .pipe(take(1));
  }

  updatePost(postId: string, body: string) {
    return this.http
      .put(
        `${environment.baseApiUrl}/feed/${postId}`,
        { body },
        this.httpOptions
      )
      .pipe(take(1));
  }

  deletePost(postId: string) {
    return this.http
      .delete(`${environment.baseApiUrl}/feed/${postId}`)
      .pipe(take(1));
  }
}
