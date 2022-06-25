import { LightningElement,wire,api } from 'lwc';
import {subscribe, MessageContext} from 'lightning/messageService'
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BOAT_TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';

export default class Subscriber extends LightningElement {
    @api recordId ;
    subscription =null;
    record;

    @wire (MessageContext)
    messageContext;
    
    subscribeToMessageChannel(){
        this.subscription=subscribe(
            this.messageContext,BOATMC, (message)=>this.handleMessage(message));
        
    }
    handleMessage(message){
        this.recordId= message.recordId ;
    }
    connectedCallback(){
        this.subscribeToMessageChannel();
    }
//// code bellow is to test calling record 
    boatObject = BOAT_OBJECT;  
    @wire (getRecord, {recordId: '$recordId' , fields:[NAME_FIELD,BOAT_TYPE_FIELD]})
    record; 
    get nameValue(){
        return this.record.data ? getFieldValue(this.record.data, NAME_FIELD): '';
    }


}