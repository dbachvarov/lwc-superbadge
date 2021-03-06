import { LightningElement,wire,api,track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import {publish, MessageContext} from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import {udateRecord, updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

const SUCCESS_TITLE ='Success';
const MESSAGE_SHIP_IT ='Ship it';
const SUCCESS_VARIANT= 'success';
const  ERROR_TITLE= 'Error';
const ERROR_VARIANT='error';
const columns =[
    {label:'Name', fieldName:'Name', type:'text', editable: 'true'},
    {label:'Length', fieldName:'Length__c', type:'number',editable:'true'},
    {label: 'Price', fieldName: 'Price__c', type: 'currency', editable: 'true'},
    {label: 'Description', fieldName: 'Description__c', type: 'text', editable:'true'}
];

export default class BoatSearchResults extends LightningElement {
    boatTypeId='' ;
    selectedBoatId='';
    @track boats;
    @track draftValues=[];
    error=undefined;
    loading;
    isLoading=false;
    wiredBoatsResult; 
    columns=columns;

    @wire (MessageContext) messageContext;
 
    @api 
    searchBoats(boatTypeId){
        this.isLoading=true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId=boatTypeId;
    }

    @wire(getBoats,{boatTypeId: '$boatTypeId'})
     wiredBoats({data, error}){
        if(data){
            this.boats= data;
            this.error=undefined;
        } else if(error){
            this.error=error;
            this.boats=undefined;
        }   
    }  
    updateSelectedTile(event){
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
        //const payload = {recordId: this.selectedBoatId};
        //publish(this.messageContext, BOATMC, payload);
    }
    sendMessageService(boatId){
        const message={
            recordId: boatId
        };
        publish(this.messageContext,BOATMC,message);
    }

   /* 
   
        this.notifyLoading(true);
        const recordInputs= event.detail.draftValues.slice().map(draft=>{
            const fields=Object.assign({}, draft);
            return {fields};
        });
        const promises = recordInputs.map(recordInput=>updateRecord(recordInput));
        Promise.all(promises).then(res=>{
            this.dispatchEvent(new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: MESSAGE_SHIP_IT,
                variant: SUCCESS_VARIANT
                })
            );
            this.draftValues =[];
            return this.refresh();
        }).catch(error=>{
            this.error=error;
            this.dispatchEvent(
                new ShowToastEvent(
                    {
                        title:ERROR_TITLE,
                        message: 'Contct System Admin!',
                        variant: ERROR_VARIANT
                    })
            );
            this.notifyLoading(false);
        }).finally(()=>{
            this.draftValues=[];
        });
    } */
    
    handleSave(event) {
        this.notifyLoading(true);
        const updatedFields = event.detail.draftValues;
        updateBoatList({data: updatedFields})
        .then(() => {
           this.dispatchEvent(
                new ShowToastEvent({
                   title: SUCCESS_TITLE,
                   message: MESSAGE_SHIP_IT,
                   variant: SUCCESS_VARIANT
               })
           );
           this.draftValues = [];
           this.refresh();
        }).catch(error => {
           this.error = error;
           this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_TITLE ,
                    message: error.body.message,
                    variant: ERROR_VARIANT
                })
            );
           
       }).finally(() => {
        this.notifyLoading(false);
        });
    }
    @api 
    async refresh(){
        this.isLoading=true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading=false;
        this.notifyLoading(this.isLoading);
    }

    notifyLoading(isLoading){
        if(isLoading){
            this.dispatchEvent(new CustomEvent('loading'));
        }else{
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
    // dispatche custome event called loading 
}