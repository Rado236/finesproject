import { Time } from "@angular/common";

export interface Fine {
    firstname:string;
    lastname:string;
    price:number;
    date:Date;
    time:Time;
    issueruid:string;
    reason:string;
    issuer:string;
    image:string;
    [key:string]:any;
}