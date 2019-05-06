import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/classes/User';
import { ApiResponseInterface } from '../../interfaces/apiResponse';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'grohe-dpf-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent{

  public countries:object[] = [];
  passwordForm = new FormGroup({
    password : new FormControl('',[Validators.required, Validators.minLength(8)]),
    passwordre : new FormControl('',[Validators.required, Validators.minLength(8)])
  });

  constructor(
    public user: UserService,
    public ui: UiService,

    private error: ErrorService,
  ) {

    if(this.user.checked){
      this.setFormData();
    }
    else{
      this.user.loggedInStateObserver.subscribe(
        loggedIn => {
          console.log('subscripten');
          console.log(loggedIn);
          if(loggedIn){
            this.setFormData();
          }
        }
      )
    }
  }

  private setFormData(){

  }

  public onSubmit(){
    if (this.passwordForm.status == 'VALID') {
      let data = {
        id:this.user.data.id.value,
        password:this.passwordForm.get('password').value
      };

      this.user.changePassword( data).subscribe(
        (response:ApiResponseInterface) => {
          if(response.success){
            this.ui.setMessage('Save success');
          }
        },
        error => {
          this.error.setError(error);
          this.ui.setMessage('An Error occoured');
        }
      );
    }
  }
}
