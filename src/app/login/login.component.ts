import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  show_password=false;
  loginForm:FormGroup=new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',Validators.required)
  })
  constructor(private auth:AuthService,private router:Router,private frauth:AngularFireAuth){}


  logIn(){
    if (this.loginForm.valid){
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.auth.signIn(email,password).then((res:any)=>{
      this.router.navigate(['/']);
    }).catch((error:any)=>{
      console.log(error);
    });
    }else{
      console.log("Invalid")
    }
  }
  showPassword(){
    this.show_password = !this.show_password
  }

}
