import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { UserRegisterModel } from '../models/register-request.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService,private router: Router) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Authenticate/login`, {
      email: request.email,
      password: request.password
    }).pipe(
      tap(response =>{
        if(response.userId){
          localStorage.setItem('userId',response.userId);
        }
        this.setUser({
          email:response.email,
        });
      })
    );
  }

  setUser(user: User): void {
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
  }

  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  logout(): void {
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }

  getUser(): User | undefined {
    const email = localStorage.getItem('user-email');

    if (email) {
      const user: User = {
        email: email
      };

      return user;
    }

    return undefined;
  }

  register(user: UserRegisterModel): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/Authenticate/register`, user);
  }

  isLoggedIn(): boolean {
     const userId = localStorage.getItem('userId');
    return !!userId;
  }

  redirectToLogin() {
    this.router.navigate(['/login']); 
  }
}
