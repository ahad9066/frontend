import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
// import { Login } from '../../store/actions/login.action';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Login } from '../../store/actions/auth.action';
import { SharedService } from 'src/modules/shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  showPass = false;
  loginForm: any;
  isLoginSuccess = null;
  fetching = false;
  readonly subscriptions: Array<Subscription> = [];
  constructor(private fb: FormBuilder,
    private router: Router, private store: Store, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator()]],
      password: ['', [Validators.required]],
    });
  }
  usernameValidator() {
    return (control) => {
      const value = control.value;
      if (!value) {
        return { required: true };
      }

      const emailPattern = /^\w+@\w+\.\w{2,3}$/;
      const phonePattern = /^\d{10}$/;

      if (emailPattern.test(value)) {
        return null; // Valid email
      } else if (phonePattern.test(value)) {
        return null; // Valid phone number
      } else {
        return { invalidFormat: true }; // Invalid format
      }
    };
  }
  signIn() {
    console.log('submit', this.loginForm);
    if (this.loginForm.valid) {
      this.fetching = true;
      this.subscriptions.push(
        this.store.dispatch(new Login({ username: this.loginForm.value.username, password: this.loginForm.value.password })).subscribe(
          () => {
            const previousUrl = sessionStorage.getItem('previousUrl');
            if (previousUrl) {
              console.log("previousUrl", previousUrl)
              sessionStorage.removeItem('previousUrl');
              this.router.navigateByUrl(previousUrl);
            } else {
              this.router.navigateByUrl('/');
            }
          },
          (error: HttpErrorResponse) => {
            console.error('error: ', error);
            this.fetching = false;
            this.sharedService.showErrors("'Something went wrong! please try again!'");
          }
        )
      );
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((data) => data.unsubscribe());
  }
}
