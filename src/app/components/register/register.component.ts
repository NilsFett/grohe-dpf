import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'grohe-dpf-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  loginForm = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
    passwd : new FormControl('',[Validators.required, Validators.minLength(4)])
  });

  constructor(
    public user: UserService,
    public router: Router
  ) {

    
  }

  public onSubmit(){
    console.log(this.loginForm.valid);
    if (this.loginForm.status == 'VALID') {
      this.user.login( this.loginForm.get('email').value, this.loginForm.get('passwd').value );
    }
  }
}
