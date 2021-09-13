import { LightningElement,wire,api,track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';


export default class BoatSearchResults extends LightningElement {
    boatTypeId='' ;
    @track boats;
    error;
    loading;
    isLoading=false;

    @api 
    searchBoats(boatTypeId){
        this.isLoading=true;
        this.boatTypeId=boatTypeId;
    }

    @wire(getBoats,{boatTypeId: '$boatTypeId'})
     wiredBoats({data, error}){
        if(data){
            this.boats= data;
            this.error=undefined;
        } else if(error){
            this.erro=erro;
            this.boats=undefined;
        }   
    }  
   
    // dispatche custome event called loading 
}