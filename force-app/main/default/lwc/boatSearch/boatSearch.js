import {LightningElement, track} from 'lwc';

export default class BoatSearch extends LightningElement {
    isLoading = false;
    boatTypeId='';
    
    // Handles loading event
    handleLoading() { }
    
    // Handles done loading event
    handleDoneLoading() { }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {
        this.boatTypeId = event.detail.boatTypeId;
        const boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-results').searchBoats(boatTypeId);
       
    }
    
    createNewBoat() { }
  }
  