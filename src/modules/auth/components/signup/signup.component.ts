import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { SharedService } from 'src/modules/shared/services/shared.service';
import { Store } from '@ngxs/store';
import { SignUp } from '../../store/actions/auth.action';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: any;
  showPass = false;
  showConfirmPass = false;
  fetching = false;
  isRegisterSuccess = false;
  error = null;
  showBanner = false;
  provinceList = [
    { key: 'ALBERTA', value: 'AB', name: 'Alberta' },
    { key: 'BRITISH_COLUMBIA', value: 'BC', name: 'British Columbia' },
    { key: 'MANITOBA', value: 'MB', name: 'Manitoba' },
    { key: 'NEW_BRUNSWICK', value: 'NB', name: 'New Brunswick' },
    { key: 'NEWFOUNDLAND_AND_LABRADOR', value: 'NL', name: 'Newfoundland and Labrador' },
    { key: 'NOVA_SCOTIA', value: 'NS', name: 'Nova Scotia' },
    { key: 'ONTARIO', value: 'ON', name: 'Ontario' },
    { key: 'PRINCE_EDWARD_ISLAND', value: 'PE', name: 'Prince Edward Island' },
    { key: 'QUEBEC', value: 'QC', name: 'Quebec' },
    { key: 'SASKATCHEWAN', value: 'SK', name: 'Saskatchewan' },
    { key: 'NORTHWEST_TERRITORIES', value: 'NT', name: 'Northwest Territories' },
    { key: 'NUNAVUT', value: 'NU', name: 'Nunavut' },
    { key: 'YUKON', value: 'YU', name: 'Yukon' }
  ]
  readonly subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private sharedService: SharedService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.pattern('^([A-Za-z\\s]{5,25})$')]],
        lastName: ['', [Validators.required, Validators.pattern('^([A-Za-z\\s]{5,25})$')]],
        mobile: ['', [Validators.required, Validators.pattern('^([0-9]{10})$')]],
        password: ['', [Validators.required, Validators.pattern('^([A-Za-z0-9*$@._-]{5,25})$')]],
        confirmPassword: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$'),
          ],
        ],
        address: this.fb.group({
          unitNumber: ['', [Validators.required]],
          buildingNumber: ['', [Validators.required]],
          streetName: ['', [Validators.required]],
          city: ['', [Validators.required]],
          province: ['', [Validators.required]],
          postalCode: ['', [Validators.required, this.canadianPostalCodeValidator()]],
          country: ['CANADA', [Validators.required]],
        })
      },
      {
        validator: this.passwordMatcher('password', 'confirmPassword'),
      }
    );
  }
  canadianPostalCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const postalCodePattern = /^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])\s{0,1}(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/;

      if (control.value && !postalCodePattern.test(control.value.toUpperCase())) {
        return { 'invalidPostalCode': true };
      }

      return null;
    };
  }
  passwordMatcher(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  isNumber(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      return true;
    } else {
      return false;
    }
  }
  submit() {
    console.log('submit', this.signUpForm)
    console.log('submit value', this.signUpForm.value)
    if (this.signUpForm.valid) {
      this.fetching = true;
      const dataToSubmit = {};
      _.set(dataToSubmit, 'firstName', this.signUpForm.value.firstName);
      _.set(dataToSubmit, 'lastName', this.signUpForm.value.lastName);
      _.set(dataToSubmit, 'countryCode', '+1');
      _.set(dataToSubmit, 'mobile', this.signUpForm.value.mobile);
      _.set(dataToSubmit, 'email', this.signUpForm.value.email);
      _.set(dataToSubmit, 'password', this.signUpForm.value.password);
      _.set(dataToSubmit, 'isMobileVerified', false);
      _.set(dataToSubmit, 'isEmailVerified', false);
      const address = {};
      _.set(address, 'unitNumber', this.signUpForm.value.address.unitNumber)
      _.set(address, 'buildingNumber', this.signUpForm.value.address.buildingNumber)
      _.set(address, 'streetName', this.signUpForm.value.address.streetName)
      _.set(address, 'city', this.signUpForm.value.address.city)
      _.set(address, 'province', this.signUpForm.value.address.province)
      _.set(address, 'postalCode', this.signUpForm.value.address.postalCode)
      _.set(address, 'country', this.signUpForm.value.address.country)
      _.set(address, 'isDefault', true)
      _.set(dataToSubmit, 'address', address);
      this.subscriptions.push(
        this.store.dispatch(new SignUp(dataToSubmit)).subscribe(
          () => {
            this.router.navigate(['/auth/login']);
          },
          (error: HttpErrorResponse) => {
            console.error('error: ', error);
            this.fetching = false;
            this.sharedService.showErrors("'Something went wrong! please try again!'");
          }
        )
      );
    } else {
      this.sharedService.showErrors("Please fill the form")
    }
  }
  bannerClosed(e) {
    console.log('banner closed', e);
  }
  cancel() {
    this.signUpForm.reset();
    this.router.navigate(['../'], { relativeTo: this.activateRoute });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
