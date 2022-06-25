import { LightningElement, api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS= "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS="tile-wrapper";
// imports
export default class BoatTile extends LightningElement {
    @api boat;
    @api selectedBoatId 
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { 
        return `background-image:url(${this.boat.Picture__c})`;  
    }
    
    @api
    get tileClass() {
        //return this.selectedBoatId ? this.TILE_WRAPPER_SELECTED_CLASS :this.TILE_WRAPPER_UNSELECTED_CLASS;
        return this.selectBoatId ==this.boat.Id ? TILE_WRAPPER_SELECTED_CLASS :TILE_WRAPPER_UNSELECTED_CLASS;
    }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() { 
        this.selectedBoatId = !this.selectedBoatId;
        const eventSelect = new CustomEvent('boatselect', { detail:{boatId:this.boat.Id} });
        this.dispatchEvent(eventSelect);
    }
  }
  