import { Component, Input, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { CountryService} from '../../services/country.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/classes/User';
import { ApiResponseInterface } from '../../interfaces/apiResponse';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'grohe-dpf-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent  implements AfterViewInit{

  public countries:object[] = [];
  userForm = new FormGroup({
    lastname : new FormControl('',[Validators.required, Validators.minLength(2)]),
    firstname : new FormControl('',[Validators.required, Validators.minLength(2)]),
    department : new FormControl('',[Validators.required, Validators.minLength(2)]),
    street : new FormControl('',[Validators.required, Validators.minLength(2)]),
    zipcode : new FormControl('',[Validators.required, Validators.minLength(2)]),
    city : new FormControl('',[Validators.required, Validators.minLength(2)]),
    country : new FormControl('',[Validators.required]),
    phone : new FormControl('',[Validators.required, Validators.minLength(2)]),
    fax : new FormControl(''),
    email : new FormControl('',[Validators.required, Validators.email]),
    costcentre : new FormControl('',[Validators.required]),
    costcentrecountry : new FormControl('',[Validators.required])
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    public country: CountryService,
    private error: ErrorService,
  ) {
    console.log('constructor');
    console.log(this.user.checked);
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
    console.log('setFormData');
    this.userForm.get('lastname').setValue( this.user.data.surname.value );
    this.userForm.get('firstname').setValue( this.user.data.name.value );
    this.userForm.get('department').setValue( this.user.data.department.value );
    this.userForm.get('street').setValue( this.user.data.street.value );
    this.userForm.get('zipcode').setValue( this.user.data.zipcode.value );
    this.userForm.get('city').setValue( this.user.data.city.value );
    this.userForm.get('country').setValue( this.user.data.country.value );
    this.userForm.get('phone').setValue( this.user.data.phone.value );
    this.userForm.get('fax').setValue( this.user.data.fax.value );
    this.userForm.get('email').setValue( this.user.data.mail.value );
    this.userForm.get('costcentre').setValue( this.user.data.costcentres[0]['costno'] );
    this.userForm.get('costcentrecountry').setValue( this.user.data.costcentres[0]['description'] );
  }

  public onSubmit(){
    if (this.userForm.status == 'VALID') {
      let data = {
        id:this.user.data.id.value,
        surname:this.userForm.get('lastname').value,
        name:this.userForm.get('firstname').value,
        department:this.userForm.get('department').value,
        street:this.userForm.get('street').value,
        zipcode:this.userForm.get('zipcode').value,
        city:this.userForm.get('city').value,
        country:this.userForm.get('country').value,
        phone:this.userForm.get('phone').value,
        fax:this.userForm.get('fax').value,
        mail:this.userForm.get('email').value,
        costcentre:this.userForm.get('costcentre').value,
        costcentrecountry:this.userForm.get('costcentrecountry').value
      };

      this.user.save( data).subscribe(
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

  ngAfterViewInit(){

    if(this.country.loaded){
      this.countries = this.country.data;
    }
    else{
      this.country.dataLoadedObserver.subscribe((data)=>{
        this.countries = data;
      });
    }
  }

}
