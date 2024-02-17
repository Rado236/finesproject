import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import 'firebase/auth';
import 'firebase/firestore';
import { getFirestore, collection, query, where,doc,getDoc,addDoc, onSnapshot,deleteDoc,updateDoc   } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject, list, StorageReference } from 'firebase/storage';
import {  FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Fine } from '../interfaces/fines';
import { policeReasons,muncipalityReasons } from '../interfaces/finereasons';
import { serverTimestamp } from 'firebase/firestore';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedImages: File[] = [];
  policeReasons=policeReasons;
  muncipalityReasons=muncipalityReasons;
  public user = this.authService.getUser();
  private db=getFirestore();
  private storage=getStorage();
  department:string='';
  fines:any[]=[];
  fine:FormGroup=new FormGroup({
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl('',Validators.required),
    date: new FormControl('',Validators.required),
    time: new FormControl('',Validators.required),
    price: new FormControl('',Validators.required),
    reason: new FormControl('',Validators.required),
    image: new FormControl('',Validators.required),
  })
  constructor(public authService:AuthService,private router:Router){
  }
  async ngOnInit() {
    try{
      if(this.user){
        const docReference=doc(this.db,'users',this.user.uid)
        const userDoc= await getDoc(docReference);
        this.department=userDoc.data()?.['department'] || '';
        await this.getFines();
       
      }
    }catch(error){
      throw error;
    }
  }

  async OnSubmit(){

    if(this.user){
      const {
        firstname,
        lastname,
        date,
        time,
        reason,
        price
      }=this.fine.value
      const fineData:Fine = {
        firstname:firstname,
        lastname:lastname,
        date:date,
        time:time,
        price:price,
        reason:reason,
        image:'',
        issuer:this.user.displayName!,
        issueruid:this.user.uid,
        timestamp: serverTimestamp()
      }
      const fineRef = collection(this.db, 'fines');
      
      const docRef = await addDoc(fineRef,fineData);
      if(this.selectedImages.length>0){
        const imageUrls:string[]=[];
        for (const image of this.selectedImages) {
          const imgRef = ref(this.storage, `fine_images/${this.user?.uid}/${docRef.id}/${image.name}`);
          await uploadBytes(imgRef, image);
          imageUrls.push(await getDownloadURL(imgRef));
        }
        await updateDoc(docRef,{image:imageUrls})
      }
    }else{
      console.log("rku");
    }
  }

  signOut(){
    this.authService.signOut();
  }

  getFines(){
    const ref=collection(this.db,'fines');
    const q=query(ref,where('issueruid', '==', this.user?.uid))
    onSnapshot(q,(snapshot)=>{
      snapshot.docChanges().forEach((change)=>{
        if(change.type=="added"){
            const documentId = change.doc.id;
            const fineData = { documentId, ...change.doc.data() };
            this.fines.push(fineData);
        }
        if(change.type=="removed"){
          this.fines=this.fines.filter((f)=>f.documentId != change.doc.id);
        }
      });
    })
  }
  onFineClick(id: string) {
    this.router.navigate(['/finedetails', id]);
    console.log(id);
  }
  async deleteDoc(id: string) {
    try {
      const refer = doc(this.db, 'fines', id);
      await deleteDoc(refer);
  
      const finesImagesRef = ref(this.storage, `fine_images/${this.user?.uid}/${refer.id}`);
      await this.deleteDocStorage(finesImagesRef);
  
      console.log('Document and associated storage contents deleted successfully.');
    } catch (error) {
      console.error('Error deleting document and storage contents:', error);
    }
  }
  
  async deleteDocStorage(storageRef: StorageReference) {
    const items = await listAll(storageRef);
    const deletePromises = items.items.map(async (item) => {
      await deleteObject(item);
    });
    await Promise.all(deletePromises);
  
  }
  onImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImages = Array.from(event.target.files); 
    }
  }
  finePrice(){
      const reasonCtrl=this.fine.get('reason');
      const priceCtrl=this.fine.get('price');
      let price=0;
      if(this.department=='police'){
        const selectedReasons = this.policeReasons.filter(reason => reasonCtrl?.value.includes(reason.reason));
        for (const selectedReason of selectedReasons){
          price+=selectedReason.price;
        }
      }
      if(this.department=='muncipality'){
        const selectedReasons = this.muncipalityReasons.filter(reason => reasonCtrl?.value.includes(reason.reason));
        for(const selectedReason of selectedReasons){
          price+=selectedReason.price;
        }
      }
      priceCtrl?.setValue(price);
  }
}

