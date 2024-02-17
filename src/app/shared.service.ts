import { Injectable } from '@angular/core';
import {Firestore,collection,collectionData} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private fs:Firestore) { 
}

  getNotes(){
    let notesCollection= collection(this.fs,'fines-reasons');
    return collectionData(notesCollection,{idField:'id'})
  }
}