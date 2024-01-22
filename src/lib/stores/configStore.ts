import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { STUDY_TYPES } from "../constants";

interface StudyProperties {
  studyName: string;
  numDays: number;
  numSamples: number;
  samplePrefix: string;
  readSubjectsFromFile: boolean;
  numSubjects: number;
  subjectColumn: string;
  subjectPrefix: string;
  subjectList: string[];
  hasEveningSample: boolean;
  startSampleFromZero: boolean;
  studyType: number;
}

interface BarcodeProperties {
  generateBarcodes: boolean;
  hasBarcode: boolean;
  addName: boolean;
  numCols: number, 
  numRows: number, 
  leftMargin: number, 
  rightMargin: number, 
  topMargin: number, 
  bottomMargin: number, 
  colDist: number, 
  rowDist: number
}

interface QrCodeProperties {
  generateQrCodes: boolean;
  numSampleAlarmTimes: number;
  salivaDistances: number[];
  salivaAlarmTimes: string[];
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
const defaultStudyProps: StudyProperties = { studyName: 'Test', numDays: 1, numSamples: 2, samplePrefix: "S", readSubjectsFromFile: false, numSubjects: 1, subjectList: [], subjectColumn: 'subject', subjectPrefix: 'VP_', hasEveningSample: false, startSampleFromZero: false, studyType: STUDY_TYPES[0] }
const defaultBarcodeProps: BarcodeProperties = { generateBarcodes: true, hasBarcode: false, addName: false, numCols: 4, numRows: 12, leftMargin: 9.8, rightMargin: 9.8, topMargin: 21.2, bottomMargin: 21.2, colDist: 2.5, rowDist: 0 }
const defaultQrCodeProps: QrCodeProperties = { generateQrCodes: true, numSampleAlarmTimes: 0, salivaDistances: [], salivaAlarmTimes: [], contact: '', checkDuplicates: false, enableManualScan: false }

// Create the stores
export const studyProps = storedStudyProps ? writable<StudyProperties>(JSON.parse(storedStudyProps)) : writable<StudyProperties>(defaultStudyProps);
export const barcodeProps = storedBarcodeProps ? writable<BarcodeProperties>(JSON.parse(storedBarcodeProps)) : writable<BarcodeProperties>(defaultBarcodeProps);
export const qrCodeProps = storedQrCodeProps ? writable<QrCodeProperties>(JSON.parse(storedQrCodeProps)) : writable<QrCodeProperties>(defaultQrCodeProps);

export const studyPropsValid = writable(Boolean(storedStudyProps));
export const barcodePropsValid = writable(Boolean(storedBarcodeProps));
export const qrCodePropsValid = writable(Boolean(storedQrCodeProps));

if (browser) {
  // Update the local storage when the store changes
  studyProps.subscribe((value) => {
    if (studyPropsValid) {
      localStorage.storedStudyProps = JSON.stringify(value);
    }
  });
  barcodeProps.subscribe((value) => {
    if (barcodePropsValid) {
      localStorage.storedBarcodeProps = JSON.stringify(value);
    }
  });
  qrCodeProps.subscribe((value) => {
    if (qrCodePropsValid) {
      localStorage.storedQrCodeProps = JSON.stringify(value)
    }
  });
}
