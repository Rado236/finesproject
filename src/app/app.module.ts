import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {provideFirebaseApp,getApp,initializeApp} from '@angular/fire/app';
import {getFirestore,provideFirestore} from '@angular/fire/firestore';
import { SharedService } from './shared.service';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirestoreModule } from '@angular/fire/firestore';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { FinedetailsComponent } from './finedetails/finedetails.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';


const firebaseConfig = {
  apiKey: "AIzaSyBfZwTw3O0jW8Kl43QRLCGchzJ8ie-0Aic",
  authDomain: "proben-proekt.firebaseapp.com",
  projectId: "proben-proekt",
  storageBucket: "proben-proekt.appspot.com",
  messagingSenderId: "542405012456",
  appId: "1:542405012456:web:af6d14aaf9c85ad1d2d25d",
  measurementId: "G-RKQXZGPE67"
};



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    FinedetailsComponent,
    NavbarComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    FirestoreModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule {  
  constructor(private frauth: AngularFireAuth) {
    this.frauth.setPersistence('local')
      .then(() => {
        console.log('Firebase initialized with persistence.');
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });
  }
}
