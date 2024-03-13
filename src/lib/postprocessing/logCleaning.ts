import { objectIsEmpty, unixTimeToLocalTime } from "./utils";

const PROP_AWAKENING_TYPES: { [key: string]: string } = { "spontaneous_awakening": "self-report", "alarm_stop": "alarm" }
const PROP_SAMPLING_TIME = "barcode_scanned";

const PROP_EVENING_ID = 815;

const AWAKENING_TIME = "awakening_time";
const AWAKENING_TYPE = "awakening_type";
const AWAKENING_INFO = "awakening_info";
const SAMPLING_TIME = "sampling_time";
const SAMPLING_INFO = "sampling_info";
const SAMPLING_COUNT = "sample_count";
const SALIVA_ID = "saliva_id";

export function collectData(dayData: Array<any>): { [key: string]: any } {
    // collect awakening and sampling info
    // scan dayData for awakening and sampling info and return object containing of the extracted respective info
    let result: { [key: string]: any } = {};
    let awakening = extractAwakeningInfo(dayData);
    let sampling = extractSamplingTimes(dayData);
    if (!objectIsEmpty(awakening)) {
        result[AWAKENING_INFO] = awakening;
    }
    if (!objectIsEmpty(sampling.result)) {
        result[SAMPLING_INFO] = sampling.result;
        result[SAMPLING_COUNT] = sampling.sample_count;
    }
    return result;
}

export function extractAwakeningInfo(dayData: Array<any>) {
    // return object with properties awakening time and type
    // returns empty object if no suitable information contained in dayData
    let data = extractData(dayData, Object.keys(PROP_AWAKENING_TYPES));
    let result: { [key: string]: any } = {};
    if (data.length > 0) {
        data = data[0];
    }
    if (PROP_AWAKENING_TYPES.hasOwnProperty(data[1])) {
        let type = PROP_AWAKENING_TYPES[data[1]];
        let time = unixTimeToLocalTime(+data[0]);
        result = { "awakening_time": time, "awakening_type": type };
    }
    return result;
}

export function extractSamplingTimes(dayData: Array<any>) {
    // return result object with properties sampling time and sample id and total number of samples in dayData
    // returns empty object if no suitable information contained in dayData
    let samples = extractData(dayData, PROP_SAMPLING_TIME);
    let result: { [key: string]: any } = {};
    if (samples.length > 0) {
        result = samples.map((entry) => {
            const timestamp = unixTimeToLocalTime(+entry[0]);
            const json = JSON.parse(entry[2]);
            var saliva_id = "";
            if (json.hasOwnProperty("sample_expected")) {
                // logs from newer app versions
                saliva_id = json.sample_expected;
            } else if (json.hasOwnProperty("saliva_id")) {
                // logs from older app versions
                saliva_id = "S" + json.saliva_id;
                // check whether current sample is evening sample
                if (json.id === PROP_EVENING_ID) {
                    saliva_id = "SE";
                }
            }
            return { "saliva_id": saliva_id, "sampling_time": timestamp };
        });
    }
    return { result: result, sample_count: samples.length };
}

export function dataToWideFormat(data: Array<any>): Array<any> {
    // transform collected data to pandas-style wide format
    // contains all days and samples per day in columns and all participants in rows
    let csvArray = [];

    // create header of csv file
    let dayCount = getMaxNumberOfDays(data);
    let sampleCount = getMaxNumberOfSamples(data);
    csvArray.push(createHeader(dayCount, sampleCount.saliva_ids));

    // extract unique participants -> one row per participant
    let participantArray = extractUniqueParticipants(data);

    // create data rows
    participantArray.forEach(participant => {
        csvArray.push(createParticipantRow(participant, data, sampleCount.saliva_ids));
    });
    return csvArray;
}

function extractData(dayData: Array<any>, key: (string | string[])): Array<any> {
    // extract data from dayData that matches key
    let result = [];
    if (typeof key === "string") {
        result = dayData.filter(entry => entry[1] === key);
    } else if (Array.isArray(key) && key.length > 0) {
        result = dayData.filter(entry => key.includes(entry[1]));
    }
    return result;
}

function getMaxNumberOfDays(data: Array<any>): number {
    const participantCount: { [participant: string]: number } = {};
    // count number of days per participant
    data.forEach(entry => {
        const participant = entry.participant;
        if (participant in participantCount) {
            participantCount[participant]++;
        } else {
            participantCount[participant] = 1;
        }
    });
    // get maximum number of days
    let maxCount = 0;
    for (const participant in participantCount) {
        const count = participantCount[participant];
        if (count > maxCount) {
            maxCount = count;
        }
    }
    return maxCount;
}

function getMaxNumberOfSamples(data: Array<any>): { maxCount: number, saliva_ids: Array<any> } {
    // get maximum number of samples per day from all participants
    // extract the corresponding saliva ids and use them as a reference
    let maxCount = 0;
    let saliva_ids: Array<any> = []
    data.forEach(entry => {
        const sampleCount = entry.info.sample_count;
        if (sampleCount > maxCount) {
            maxCount = sampleCount;
            saliva_ids = entry.info.sampling_info.map((e: { saliva_id: any, sampling_time: string }) => e.saliva_id);
        }
    });
    return { maxCount: maxCount, saliva_ids: saliva_ids };
}

function createHeader(dayCount: number, samples: Array<any>): Array<string> {
    // create header for csv file
    let header: Array<string> = [];
    header.push("participant");
    for (let i = 1; i <= dayCount; i++) {
        header.push("date" + "_D" + i);
        header.push(AWAKENING_TIME + "_D" + i);
        header.push(AWAKENING_TYPE + "_D" + i);
        samples.forEach(sample => {
            header.push(SAMPLING_TIME + "_" + sample + "_D" + i);
        });
    }
    return header;
}

function extractUniqueParticipants(data: Array<any>) {
    // extract unique participant ids from data
    let participantArray: Array<string> = [];
    data.forEach(entry => {
        if (!participantArray.includes(entry.participant)) {
            participantArray.push(entry.participant);
        }
    });
    return participantArray.sort();
}

function createParticipantRow(participant: string, data: Array<any>, saliva_ids: Array<any>) {
    // concatenate all data for one participant in one row for the final csv array
    let row: Array<string> = [];
    row.push(participant);
    const relevantEntries = data.filter(entry => entry.participant === participant);
    relevantEntries.forEach(entry => {
        // add day
        row.push(entry.date);
        // add awakening time and type
        if (entry.info.hasOwnProperty(AWAKENING_INFO)) {
            const awakening_info = entry.info.awakening_info;
            row.push(awakening_info.awakening_time);
            row.push(awakening_info.awakening_type);
        } else {
            row.push("");
            row.push("");
        }
        // add sampling times
        if (entry.info.hasOwnProperty(SAMPLING_INFO)) {
            const sampling_info = entry.info.sampling_info;
            saliva_ids.forEach(saliva_id => {
                const sample = sampling_info.find((e: { saliva_id: any; }) => e.saliva_id === saliva_id);
                if (sample) {
                    row.push(sample.sampling_time);
                } else {
                    row.push("");
                }
            });
        } else {
            saliva_ids.forEach(() => {
                row.push("");
            });
        }
    });
    return row;
}

