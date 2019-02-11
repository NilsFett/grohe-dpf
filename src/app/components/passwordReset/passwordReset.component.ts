import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import { ErrorService} from '../../services/error.service';
import {  FormGroup, FormControl, Validators  } from '@angular/forms';
import { Router} from '@angular/router';
import { ApiResponseInterface } from '../../interfaces/apiResponse';

@Component({
  selector: 'grohe-dpf-password-reset',
  templateUrl: './passwordReset.component.html',
  styleUrls: ['./passwordReset.component.css']
})
export class PasswordResetComponent{

  loginForm = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email])
  });
  public errorString:string = '';
  public success:boolean = false;

  constructor(
    public user: UserService,
    public router : Router,
    private error : ErrorService
  ) {

  }

  public onSubmit(){
    console.log('onsubmit');
    console.log(this.loginForm.status);
    if (this.loginForm.status == 'VALID') {
      this.user.passwordReset( {email:this.loginForm.get('email').value} ).subscribe(
        (response:ApiResponseInterface) => {
          console.log('RESPONSE');
          console.log(response.success);
          if(response.success){
            this.success = true;
          }
          else{
            console.log('ERROR');
            console.log(response.error);
            this.errorString = response.error;
          }
        },
        error => {
          this.error.setError(error);
        }
      );
    }
  }
}
