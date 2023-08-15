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
                saliva_id = json.saliva_id;
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
    let csvArray = [];

    // create header of csv file
    let dayCount = getMaxNumberOfDays(data);
    let sampleCount = getMaxNumberOfSamples(data);
    csvArray.push(createHeader(dayCount, sampleCount.saliva_ids));

    // extract unique subjects -> one row per subject
    let subjectArray = extractUniqueSubjects(data);

    // create data rows
    subjectArray.forEach(subject => {
        csvArray.push(createSubjectRow(subject, data, sampleCount.saliva_ids));
    });
    console.log(csvArray);
    return csvArray;
}

function extractData(dayData: Array<any>, key: (string | string[])): Array<any> {
    let result = [];
    if (typeof key === "string") {
        result = dayData.filter(entry => entry[1] === key);
    } else if (Array.isArray(key) && key.length > 0) {
        result = dayData.filter(entry => key.includes(entry[1]));
    }
    return result;
}

function getMaxNumberOfDays(data: Array<any>): number {
    const subjectCount: { [subject: string]: number } = {};
    // count number of days per subject
    data.forEach(entry => {
        const subject = entry.subject;
        if (subject in subjectCount) {
            subjectCount[subject]++;
        } else {
            subjectCount[subject] = 1;
        }
    });
    // get maximum number of days
    let maxCount = 0;
    for (const subject in subjectCount) {
        const count = subjectCount[subject];
        if (count > maxCount) {
            maxCount = count;
        }
    }
    return maxCount;
}

function getMaxNumberOfSamples(data: Array<any>): { maxCount: number, saliva_ids: Array<any> } {
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
    let header: Array<string> = [];
    header.push("subject");
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

function extractUniqueSubjects(data: Array<any>) {
    let subjectArray: Array<string> = [];
    data.forEach(entry => {
        if (!subjectArray.includes(entry.subject)) {
            subjectArray.push(entry.subject);
        }
    });
    return subjectArray.sort();
}

function createSubjectRow(subject: string, data: Array<any>, saliva_ids: Array<any>) {
    let row: Array<string> = [];
    row.push(subject);
    const relevantEntries = data.filter(entry => entry.subject === subject);
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
            console.log(sampling_info);
            saliva_ids.forEach(saliva_id => {
                //console.log(sampling_info.some((e: { saliva_id: any; }) => e.saliva_id === "SE"));
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

