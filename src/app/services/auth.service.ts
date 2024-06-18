import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {getAuth ,User} from '@firebase/auth';
import firebase from 'firebase/compat/app';
import { getFirestore,doc,setDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';


interface MoreUserInfo extends firebase.UserInfo{
  department:string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService{
  currentlySignedInUserAvatarURL:any;
  constructor(private frauth:AngularFireAuth,private router:Router,private storage:AngularFireStorage) {
    this.frauth.onAuthStateChanged((user) => {
      if (user) {
        console.log("logged in",user.displayName);
        this.getAvatar(user.uid);
      } else {
        console.log("user logged out");
      }
    });
  }

  
  async register(email: string, password: string, department: string,displayName:string,phoneNumber:string,avatarFile:File){
    try {
      const userCredential: firebase.auth.UserCredential = await this.frauth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      if (!user) {
        throw new Error('User creation failed.');
      }
      const avatarUrl=await this.uploadAvatarStorage(avatarFile,user.uid);
      
      await user.updateProfile({
        displayName: displayName,
        photoURL: avatarUrl,
      });
      
      const UserData: MoreUserInfo = {
        displayName: user.displayName ?? null,
        email: user.email ?? null,
        uid: user.uid ?? null,
        phoneNumber: phoneNumber,
        photoURL: user.photoURL ?? null,
        providerId: user.providerId ?? null,
        department: department
      };
      await this.SetUserData(UserData);
      return UserData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
  async signIn(email:string,password:string){
    return this.frauth.signInWithEmailAndPassword(email,password);
  }
  async signOut(){
    this.frauth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  getUser():User|null{
    const auth=getAuth();
    return auth.currentUser;
  }
  SetUserData(user:MoreUserInfo){
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  setDoc(userRef, user) 
      .then(() => {
        console.log('User data stored in Firestore.');
      })
      .catch((error) => {
        console.error('Error storing user data:', error);
      });
  }
  async uploadAvatarStorage(img:File,uid:string){
    const uploadTask = await this.storage.upload('avatars/' + uid, img);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    this.currentlySignedInUserAvatarURL = downloadURL;
    return downloadURL;
  }
  async getAvatar(uid:string){
    try{
      const downloadUrlObs=await this.storage.ref('avatars/'+uid).getDownloadURL();
      const downloadUrl = await downloadUrlObs.toPromise();
      this.currentlySignedInUserAvatarURL=downloadUrl
    }catch(error){
      this.currentlySignedInUserAvatarURL="https://wbi.net.au/wp-content/uploads/2019/04/person-icon-silhouette-png-12-1-e1555982192147.png";
    }
  } 
}
  