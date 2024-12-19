import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { NewUser } from '../models/newUser.model';
import { Role, User } from '../models/user.model';
import { UserResponse } from '../models/userResponse.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<UserResponse['user'] | null>(null);  // Assuming BehaviorSubject setup

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get userStream(): Observable<User | null> {
    return this.user$.asObservable();
  }

  get isUserLoggedIn(): Observable<boolean> {
    console.log("isUserLoggedIn: ", this.user$);
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        console.log("isUserLoggedIn|switchMap: ", user);
        const isUserAuthenticated = user !== null;
        console.log("isUserLoggedIn|switchMap: ", isUserAuthenticated);
        return of(isUserAuthenticated);
      })
    );
  }

  get userId(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => of(user?.id ?? "")) // Default to `0` or another fallback if `user` is `null`
    );
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        const fullName = user ? `${user.firstName} ${user.lastName}` : '';
        return of(fullName);
      })
    );
  }

  get userFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        // const doesAuthorHaveImage = !!user?.imagePath;
        let fullImagePath = this.getDefaultFullImagePath();
        return of(fullImagePath);
      })
    );
  }

  constructor(private http: HttpClient, private router: Router) {}

  getDefaultFullImagePath(): string {
    return 'http://localhost:3000/api/feed/image/blank-profile-picture.png';
  }

  getFullImagePath(imageName: string): string {
    return 'http://localhost:3000/api/feed/image/' + imageName;
  }

  getUserImage() {
    return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1));
  }

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`)
      .pipe(take(1));
  }

  updateUserImagePath(imagePath: string): Observable<User | null> {
    return this.user$.pipe(
      take(1 ),
      map((user: User | null) => {
        if(user){
          //user.imagePath = imagePath;
          this.user$.next(user);
          return user;
        } else {
          return null;
        }

      })
    );
  }

  uploadUserImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/user/upload`,
        formData
      )
      .pipe(
        tap(({ modifiedFileName }) => {
          let user = this.user$.value;
          if(user){
            // /user.imagePath = modifiedFileName;
            this.user$.next(user);
          }
        })
      );
  }

  register(newUser: NewUser): Observable<User> {
    // Only send the basic user data
    const basicUserDetails = {
      userName: newUser.userName,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password
    };

    return this.http
      .post<NewUser>(`${environment.baseApiUrl}/auth/register`, basicUserDetails)
      .pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        { email, password }
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          Preferences.set({
            key: 'token',
            value: response.token,
          });
          const decodedToken: UserResponse = jwtDecode(response.token);
          console.log(decodedToken);
          this.user$.next(decodedToken.user);
        })
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return from(
      Preferences.get({
        key: 'token',
      })
    ).pipe(
      map((data) => {
        console.log("data: ", data);
        const token = data.value;
        if (!token) return false;

        const decodedToken: UserResponse = jwtDecode(token);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return false;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    Preferences.remove({ key: 'token' });
    this.router.navigateByUrl('/auth');
  }
}
