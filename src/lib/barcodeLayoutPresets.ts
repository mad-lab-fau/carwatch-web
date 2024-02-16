export interface BarcodeLayoutPreset {
  id: string;
  name: string;
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
  name: "Avery Zweckform J4791",
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

export const PRESETS = [ AVERY_J4791 ];
