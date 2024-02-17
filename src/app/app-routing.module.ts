import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthguardService } from './services/authguard.service';
import { RegisterComponent } from './register/register.component';
import { FinedetailsComponent } from './finedetails/finedetails.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {path: "",component:HomeComponent,canActivate:[AuthguardService]},
  {path: "login",component:LoginComponent},
  {path: "register",component:RegisterComponent},
  {path: "finedetails/:id",component:FinedetailsComponent,canActivate:[AuthguardService]},
  {path:"profile/:id",component:ProfileComponent,canActivate:[AuthguardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
