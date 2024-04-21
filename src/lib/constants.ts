/* constants for study configuration */

export const CAR_STUDY = 1;
export const LAB_STUDY = 2;
export const OTHER_STUDY = 3;
export const STUDY_TYPES = [CAR_STUDY, LAB_STUDY, OTHER_STUDY];
export const APP_OPTION = {CAR_STUDY: true, LAB_STUDY: false, OTHER_STUDY: true};
export const DEFAULT_SALIVA_DISTANCE = 15; 
export const DEFAULT_NUM_SAMPLE_ALARM_TIMES = 0;
export const DEFAULT_SALIVA_TIME = "12:00"
/* constants to create QR code data */
export const QR_PARSER_APP_ID = "CARWATCH";
export const QR_PARSER_SEPARATOR = ";";
export const QR_PARSER_SPECIFIER = ":";
export const QR_PARSER_LIST_SEPARATOR = ",";
export const QR_PARSER_PROPERTY_STUDY_NAME = "N";
export const QR_PARSER_PROPERTY_STUDY_DAYS = "D";
export const QR_PARSER_PROPERTY_NUM_PARTICIPANTS = "NP";
export const QR_PARSER_PROPERTY_PARTICIPANT_ID = "PID";
export const QR_PARSER_PROPERTY_SALIVA_TIMES = "T";
export const QR_PARSER_PROPERTY_SALIVA_ALARMS = "A";
export const QR_PARSER_PROPERTY_START_SAMPLE = "SS";
export const QR_PARSER_PROPERTY_EVENING = "E";
export const QR_PARSER_PROPERTY_CONTACT = "M";
export const QR_PARSER_PROPERTY_DUPLICATES = "FD";
export const QR_PARSER_PROPERTY_GOOGLE_FIT = "GF";
export const QR_PARSER_PROPERTY_MANUAL_SCAN = "FM";
export const QR_PARSER_PROPERTY_WEB_APP_VERSION = "V";

export const FORBIDDEN_CHARACTERS = [QR_PARSER_LIST_SEPARATOR, QR_PARSER_SEPARATOR, QR_PARSER_SPECIFIER];

export const A4_WIDTH = 210;
export const A4_HEIGHT = 297;
export const LETTER_WIDTH = 215.9;
export const LETTER_HEIGHT = 279.4;
