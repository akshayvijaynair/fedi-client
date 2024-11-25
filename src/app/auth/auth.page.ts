import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from './models/newUser.model';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  @ViewChild('form') form: NgForm | undefined;

  submissionType: 'login' | 'join' = 'login';

  constructor(private authService: AuthService, private router: Router) {}


  onSubmit() {
    const { username, password } = this.form?.value;
    if (!username || !password) return;

    if (this.submissionType === 'login') {
      return this.authService.login(username, password).subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    } else {
      // if (this.submissionType === 'join')
      const { firstName, lastName, email } = this.form?.value;
      if (!firstName || !lastName) return;

      const newUser: NewUser = { email, firstName, lastName, username, password };

      return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });
    }
  }

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }
}
