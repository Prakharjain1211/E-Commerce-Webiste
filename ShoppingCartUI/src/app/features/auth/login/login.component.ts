import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  model: LoginRequest;
  errorMessage: string = '';

  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router) {
    this.model = {
      email: '',
      password: ''
    };
  }


  onFormSubmit(form: any): void {
    if (form.valid) {
      this.authService.login(this.model).subscribe({
        next: (response) => {
          // Set Auth Cookie
          localStorage.setItem('token',response.token); 
          this.cookieService.set('Authorization', `Bearer ${response.token}`, undefined, '/', undefined, true, 'Strict');

          // Set User
          this.authService.setUser({
            email: response.email,

          });

          // Redirect back to Home
          if(this.model.email === 'admin@example.com')
          {
            this.router.navigateByUrl('/categories');
          }
          else
          {
          this.router.navigateByUrl('/');
          }
        },
        error: () => {
          this.errorMessage = 'Invalid credentials';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields';
    }
  }

  

}
