import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { getFirestore, orderBy, query,collection,limit, getDocs, QuerySnapshot, where } from 'firebase/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  public user = this.authService.getUser();
  public lastFines: any[] = [];
  constructor(public authService:AuthService){}
  ngOnInit() {
    this.getLastFines();
  }
  getLastFines(){
    const db=getFirestore();
    const collectionRef=collection(db,'fines');
    const q=query(collectionRef,where('issueruid', '==', this.user?.uid),limit(3),orderBy("timestamp","desc"))
    this.lastFines = [];
    getDocs(q).then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        this.lastFines.push(doc.data());
      })
    });
  }
  

}
