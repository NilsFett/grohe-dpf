import { Component, AfterViewInit, ElementRef} from '@angular/core';
import { UserService} from '../../services/user.service';
import { CountryService} from '../../services/country.service';
import { ErrorService } from '../../services/error.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { ApiResponseInterface } from '../../interfaces/apiResponse';

@Component({
  selector: 'grohe-dpf-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit{
  public showSuccessMessage = false;
  public errorMessage;
  public countries:object[] = [];
  registerForm = new FormGroup({
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

  get f() { return this.registerForm.controls; }

  constructor(
    public user: UserService,
    public country: CountryService,
    public router: Router,
    private error: ErrorService,
    private el: ElementRef
  ) {

  }

  public onSubmit(){
    if (this.registerForm.status == 'VALID') {
      let data = {
        surname:this.registerForm.get('lastname').value,
        name:this.registerForm.get('firstname').value,
        department:this.registerForm.get('department').value,
        street:this.registerForm.get('street').value,
        zipcode:this.registerForm.get('zipcode').value,
        city:this.registerForm.get('city').value,
        country:this.registerForm.get('country').value,
        phone:this.registerForm.get('phone').value,
        fax:this.registerForm.get('fax').value,
        mail:this.registerForm.get('email').value,
        costcentre:this.registerForm.get('costcentre').value,
        costcentrecountry:this.registerForm.get('costcentrecountry').value
      };

      this.user.register( data).subscribe(
        (response:ApiResponseInterface) => {
          if(response.success){
            this.showSuccessMessage = true;
            this.el.nativeElement.style.display =`none`;
            this.el.nativeElement.style.display =`block`;
          }
          else{
            this.errorMessage = response.error;
          }
        },
        error => {
          this.error.setError(error);
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
