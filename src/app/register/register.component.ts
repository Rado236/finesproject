import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  avatarFile: File | null = null;
  registration:FormGroup=new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',Validators.required),
    displayName: new FormControl('',Validators.required),
    department: new FormControl('',Validators.required),
    phoneNumber: new FormControl('',Validators.required),
    photoURL: new FormControl('')
  })

  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router){
  }
  OnSubmit(){
    if(this.registration.valid){
      this.register();
    }else{
      console.log("There was an error")
    }
  }

   register(){
    const email = this.registration.value.email;
    const password = this.registration.value.password;
    const displayName = this.registration.value.displayName;
    const department = this.registration.value.department;
    const phoneNumber = this.registration.value.phoneNumber;
    const photoURL = this.registration.value.photoURL;
    this.auth.register(email,password,department,displayName,phoneNumber,photoURL).then((res:any)=>{
      if(photoURL){
        this.auth.uploadAvatarStorage(this.avatarFile!, res.uid);
        this.router.navigate(['login']);
      }
    }).catch((error:any)=>{
      console.log(error);
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.avatarFile = file;
    }
  }

}
