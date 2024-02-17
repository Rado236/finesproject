import { Component, NgModule, OnInit } from '@angular/core';
import { AngularFirestore, DocumentSnapshot} from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Fine } from '../interfaces/fines';
import { collection, doc, getDoc, getFirestore, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { FormBuilder, FormGroup } from '@angular/forms';




@Component({
  selector: 'app-finedetails',
  templateUrl: './finedetails.component.html',
  styleUrls: ['./finedetails.component.scss']
})
export class FinedetailsComponent implements OnInit{
  modify:FormGroup;
  fineData:any;
  db = getFirestore();
  constructor(private route: ActivatedRoute,private fb:FormBuilder) {
    this.modify=this.fb.group({
      firstname:[''],
      lastname:[''],
      price:['']
    })
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const fineRef = doc(this.db, "fines",id);
        const document = await getDoc(fineRef);
        onSnapshot(fineRef, (snapshot) => {
          if (snapshot.exists()) {
            this.fineData = snapshot.data() as Fine;
            this.modify.patchValue(this.fineData);
          } else {
            console.log('Fine document does not exist');
          }
        });
        if (document.exists()) {
          this.fineData = document.data() as Fine;   
        } else {
          console.log('Fine document does not exist');
        }
      } catch (error) {
        console.error('Error fetching fine document:', error);
      }
    }
  }
  async onSubmit(){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      try{
        const ref = doc(this.db,'fines',id);
        const timestamp = serverTimestamp();
        const data = {...this.modify.value,timestamp};
        const document = await getDoc(ref);
        if(document.exists()){
          const exsistingData=document.data() as Fine;
          const updatedData:any = {};
          for(const key in data) {
            if(data[key] !== exsistingData[key] && data[key]!== ''){
              updatedData[key]=data[key];
            }
          }
          if(Object.keys(updatedData).length > 0){
            await updateDoc(ref,updatedData);
          }else{
            console.log("error");
          }
        }
    }catch (error) {
      console.error('Error fetching fine document:', error);
    }
  } else {
    console.log('Fine document does not exist');
  }
}

}



