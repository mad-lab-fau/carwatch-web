import { writable } from "svelte/store";

export const formData = writable();

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
    layout: {numCols: number, numRows: number, leftMargin: number, rightMargin: number, topMargin: number, bottomMargin: number, colDist: number, rowDist: number};
}

interface QrCodeProperties {
    salivaDistances: string;
    contact: string;
    checkDuplicates: boolean;
    enableManualScan: boolean;
}

// Create the base stores for each data type
export const studyProps = writable<StudyProperties>({studyName: 'Test', numDays: 0, numSamples: 0, samplePrefix: "S", readSubjectsFromFile: false, numSubjects: 0, subjectPath: '', subjectColumn: 'subject', subjectPrefix: 'VP_', hasEveningSample: false, startSampleFromZero: false, studyType: 0});
export const barcodeProps = writable<BarcodeProperties>({generateBarcodes: false, hasBarcode: false, addName: false, layout: {numCols: 4, numRows: 4, leftMargin: 3, rightMargin: 3, topMargin: 3, bottomMargin: 3, colDist: 3, rowDist: 3}});
export const qrCodeProps = writable();

export const test = writable("hallo");