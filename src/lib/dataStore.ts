import { browser } from "$app/environment";
import { writable } from "svelte/store";

// Create store to hold barcode data array and qr code data
let storedBarcodeDataArray;
let storedCaptionArray;
let storedQrData;

if (browser) {
  // Fetch the data from the local storage
  storedBarcodeDataArray = localStorage.storedBarcodeDataArray;
  storedCaptionArray = localStorage.storedCaptionArray;
  storedQrData = localStorage.storedQrData;
}

export const barcodeDataArray = storedBarcodeDataArray ? writable<string[]>(JSON.parse(storedBarcodeDataArray)) : writable<string[]>([]);
export const captionArray = storedCaptionArray ? writable<string[]>(JSON.parse(storedCaptionArray)) : writable<string[]>([]);
export const qrData = storedQrData ? writable<string>(storedCaptionArray) : writable<string>("");

if(browser){
  barcodeDataArray.subscribe((value) => localStorage.storedBarcodeDataArray = JSON.stringify(value));
  captionArray.subscribe((value) => localStorage.storedCaptionArray = JSON.stringify(value));
  qrData.subscribe((value) => localStorage.storedQrData = value);
}