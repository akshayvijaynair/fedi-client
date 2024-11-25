import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts';

  constructor(private http: HttpClient) {}

  searchAccounts(query: string | null): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseApiUrl}/users/search?query=${query}`);
  }
}
