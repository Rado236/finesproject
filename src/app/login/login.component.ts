import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  department="police";
  userDepartment='';
  show_password=false;
  formsubmited=false;
  private db=getFirestore();
  loginForm:FormGroup=new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',Validators.required)
  })
  authService: any;
  constructor(private auth:AuthService,private router:Router){}


  async logIn(){
    if (this.loginForm.valid){
      this.formsubmited=true;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const userCollectionRef = collection(this.db, 'users');
      const userEmailCheck = await getDocs(query(userCollectionRef, where("email", "==", email)));
      const userDoc = userEmailCheck.docs[0];
      if(userDoc.exists()){
        this.userDepartment=userDoc.data()?.['department'] || '';   
      }
      if(this.userDepartment!=this.department){
        return;
      }else{
        this.auth.signIn(email,password).then(async (res:any)=>{  
          this.router.navigate(['/']);
      }).catch((error:any)=>{
        console.log(error);
      });
      }
      
    }else{
      console.log("Invalid")
    }
  }
  showPassword(){
    this.show_password = !this.show_password
  }

   toggleSwitch(){
    this.formsubmited=false;
    const toggle = document.getElementById("checkbox") as HTMLInputElement;
    const formDiv = document.getElementById("formDiv") as HTMLElement ;
    if(toggle.checked){
      formDiv.style.backgroundImage="url('assets/trg.jpg')";   
      formDiv.style.backgroundPosition="center"; 
      formDiv.style.backgroundSize="cover"; 
      formDiv.style.transition="0.4s"
      this.department="muncipality"
    } 
    else{
      formDiv.style.backgroundImage="url('assets/MVR.jpg')";   
      formDiv.style.backgroundPosition="center"; 
      formDiv.style.backgroundSize="cover"; 
      formDiv.style.transition="0.4s"
      this.department="police";
    }
   }
}
