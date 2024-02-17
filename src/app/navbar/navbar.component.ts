import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { getFirestore, collection,doc,getDoc  } from 'firebase/firestore';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  public user = this.authService.getUser();
  private db=getFirestore();
  public department='';
  constructor(public authService:AuthService){}
  async ngOnInit() {
    try{
      if(this.user){
        const userCollectionRef = collection(this.db, 'users');
        const userDocRef = doc(userCollectionRef, this.user.uid);
        const userDoc = await getDoc(userDocRef);
        if(userDoc.exists()){
          this.department=userDoc.data()?.['department'] || '';   
        }else{
          console.log("kur")
        }
      }
    }catch(error){
      throw error;
    }
  }
  signOut(){
    this.authService.signOut();
  }
}
  

