import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate,Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private auth:AuthService,private router:Router) { }
  canActivate():boolean {
    const user= this.auth.getUser();
    if(user){
      return true;
    }else {
      this.router.navigate(['/login'])
      return false
    }
  }
}
