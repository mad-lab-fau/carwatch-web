import { browser } from "$app/environment";
import { writable } from "svelte/store";

interface StudyProperties {
  studyName: string;
  numDays: number;
  numSamples: number;
  samplePrefix: string;
  readSubjectsFromFile: boolean;
  numSubjects: number;
  subjectPath: string;
  subjectColumn: string;
  subjectPrefix: string;
  hasEveningSample: boolean;
  startSampleFromZero: boolean;
  studyType: number;
}

interface BarcodeProperties {
  generateBarcodes: boolean;
  hasBarcode: boolean;
  addName: boolean;
  layout: { numCols: number, numRows: number, leftMargin: number, rightMargin: number, topMargin: number, bottomMargin: number, colDist: number, rowDist: number };
}

interface QrCodeProperties {
  generateQrCodes: boolean;
  salivaDistances: string;
  contact: string;
  checkDuplicates: boolean;
  enableManualScan: boolean;
}

let storedStudyProps;
let storedBarcodeProps;
let storedQrCodeProps;

if (browser) {
  // Fetch the data from the local storage
  storedStudyProps = localStorage.storedStudyProps;
  storedBarcodeProps = localStorage.storedBarcodeProps;
  storedQrCodeProps = localStorage.storedQrCodeProps;
}

// Create the base stores for each data type
const defaultStudyProps: StudyProperties = { studyName: 'Test', numDays: 0, numSamples: 0, samplePrefix: "S", readSubjectsFromFile: false, numSubjects: 0, subjectPath: '', subjectColumn: 'subject', subjectPrefix: 'VP_', hasEveningSample: false, startSampleFromZero: false, studyType: 0 }
const defaultBarcodeProps: BarcodeProperties = { generateBarcodes: false, hasBarcode: false, addName: false, layout: { numCols: 4, numRows: 4, leftMargin: 3, rightMargin: 3, topMargin: 3, bottomMargin: 3, colDist: 3, rowDist: 3 } }
const defaultQrCodeProps: QrCodeProperties = { generateQrCodes: false, salivaDistances: '', contact: '', checkDuplicates: false, enableManualScan: false }

// Create the stores
export const studyProps = storedStudyProps ? writable<StudyProperties>(JSON.parse(storedStudyProps)) : writable<StudyProperties>(defaultStudyProps);
export const barcodeProps = storedBarcodeProps ? writable<BarcodeProperties>(JSON.parse(storedBarcodeProps)) : writable<BarcodeProperties>(defaultBarcodeProps);
export const qrCodeProps = storedQrCodeProps ? writable<QrCodeProperties>(JSON.parse(storedQrCodeProps)) : writable<QrCodeProperties>(defaultQrCodeProps);

export const studyPropsValid = writable(Boolean(storedStudyProps));
export const barcodePropsValid = writable(Boolean(storedBarcodeProps));
export const qrCodePropsValid = writable(Boolean(storedQrCodeProps));

if (browser) {
  // Update the local storage when the store changes
  studyProps.subscribe((value) => localStorage.storedStudyProps = JSON.stringify(value));
  barcodeProps.subscribe((value) => localStorage.storedBarcodeProps = JSON.stringify(value));
  qrCodeProps.subscribe((value) => localStorage.storedQrCodeProps = JSON.stringify(value));
}

