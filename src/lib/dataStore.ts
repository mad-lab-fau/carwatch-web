import { browser } from "$app/environment";
import { get, writable } from "svelte/store";

// Create store to hold barcode data array
let storedBarcodeDataArray;
let storedCaptionArray;

if (browser) {
  // Fetch the data from the local storage
  storedBarcodeDataArray = localStorage.storedBarcodeDataArray;
  storedCaptionArray = localStorage.storedCaptionArray;
}

export const barcodeDataArray = storedBarcodeDataArray ? writable<string[]>(JSON.parse(storedBarcodeDataArray)) : writable<string[]>([]);
export const captionArray = storedCaptionArray ? writable<string[]>(JSON.parse(storedCaptionArray)) : writable<string[]>([]);

if(browser){
  barcodeDataArray.subscribe((value) => localStorage.storedBarcodeDataArray = JSON.stringify(value));
  captionArray.subscribe((value) => localStorage.storedCaptionArray = JSON.stringify(value));
}