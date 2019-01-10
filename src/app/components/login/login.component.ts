import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import {  FormGroup, FormControl, Validators  } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  public logginIncorrect = false;


  loginForm = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
    passwd : new FormControl('',[Validators.required, Validators.minLength(4)])
  });

  constructor(
    public user: UserService,
    public router : Router,
  ) {
    this.user.loggedInStateObserver.subscribe(loggedIn => {
      console.log('logged in state changed!');
      console.log(loggedIn);
      if(loggedIn){
        this.logginIncorrect = false;
        this.router.navigate(['/start']);
      }
      else{
        this.logginIncorrect = true;
      }
    });
  }

  public onSubmit(){
    console.log(this.loginForm.valid);
    if (this.loginForm.status == 'VALID') {
      this.user.login( this.loginForm.get('email').value, this.loginForm.get('passwd').value );
    }
  }
}
