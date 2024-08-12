import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/features/auth/models/user.model';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  user?: User;

  searchQuery: string = '';

  constructor(private authService: AuthService,
    private router: Router) {
  }


  getUsername(): string {
    if (this.user && this.user.email) {
      return this.user.email.split('@')[0];
    }
    return '';
  }

  ngOnInit(): void {
    this.authService.user()
    .subscribe({
      next: (response) => {
        this.user = response;       
        
      }
    });

    this.user = this.authService.getUser();

  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  searchByCategory(event: Event) {
    event.preventDefault();
    this.router.navigate(['/'], { queryParams: { category: this.searchQuery } });
  }

}
