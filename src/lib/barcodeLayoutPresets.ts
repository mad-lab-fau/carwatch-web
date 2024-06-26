export interface BarcodeLayoutPreset {
  id: string;
  name: string;
  printFormat: string;
  labelsPerPage: number;
  numCols: number;
  numRows: number;
  distanceBetweenCols: number;
  distanceBetweenRows: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
}

const AVERY_J4791: BarcodeLayoutPreset = {
  id: "avery-j4791",
  name: "Avery Zweckform J4791-25",
  printFormat: "A4",
  labelsPerPage: 48,
  numCols: 4,
  numRows: 12,
  distanceBetweenCols: 2.5,
  distanceBetweenRows: 0,
  leftMargin: 9.8,
  rightMargin: 9.8,
  topMargin: 21.2,
  bottomMargin: 21.2
};

const AVERY_5160: BarcodeLayoutPreset = {
  id: "avery-5160",
  name: "Avery Template 5160",
  printFormat: "letter",
  labelsPerPage: 30,
  numCols: 3,
  numRows: 10,
  distanceBetweenCols: 3,
  distanceBetweenRows: 0,
  leftMargin: 4.8,
  rightMargin: 4.8,
  topMargin: 12.7,
  bottomMargin: 12.7
};

export const PRESETS = [ AVERY_J4791, AVERY_5160 ];
