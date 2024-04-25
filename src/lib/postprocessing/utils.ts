import JSZip, { type JSZipObject } from 'jszip';
import Papa from 'papaparse';


export async function extractZip(files: FileList): Promise<[]> {
    return new Promise<[]>(async (resolve, reject) => {
        const zip = new JSZip();
        let zipData: any = [];
        let loadedFiles: string[] = [];
        // iterate over individual zip files
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            try {
                // load the zip file
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const loadedZip = await zip.loadAsync(arrayBuffer);
                
                // read filenames contained in archive
                let fileNames = readContentFileNames(loadedZip, loadedFiles);
                // sort file names alphabetically => participant names and dates are ordered
                fileNames.sort();

                // collect content from all files
                await Promise.allSettled(
                    fileNames.map(async (fileName) => {
                        const file = loadedZip.file(fileName);
                        if (file) {
                            loadedFiles.push(fileName);
                            let zipEntryContent = await loadIndividualFileContent(file, fileName);
                            zipData.push(zipEntryContent);
                        }
                    })
                );
            } catch (error) {
                reject(error);
            }
        }
        if (zipData.length == 0) {
            reject("No valid log files found in zip archive.");
        }
        resolve(zipData);
    });

}

function readContentFileNames(loadedZip: JSZip, loadedFileNames: string[]): string[] {
    // read filenames contained in archive
    let fileNames: string[] = [];
    loadedZip.forEach((_, zipEntry) => {
        if (!zipEntry.dir && !loadedFileNames.includes(zipEntry.name) && nameIsValid(zipEntry.name)) {
            fileNames.push(zipEntry.name);
        }
    });
    return fileNames;
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    // read zip archive as an ArrayBuffer
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            resolve(arrayBuffer);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

async function loadIndividualFileContent(file: JSZipObject, fileName: string) {
    // parse csv file content
    const fileContent = await file.async('string');
    let zipEntryContent = { name: "", data: {} };
    zipEntryContent.name = fileName;
    zipEntryContent.data = Papa.parse(
        fileContent,
        { delimiter: ";", newline: "\n", skipEmptyLines: true }
    ).data;
    return zipEntryContent;
}

function nameIsValid(fileName: string): boolean {
    // check if the current filename has the format "studyName_participantName_yyyymmdd.csv"
  
    // check if ending is ".csv"
    let csvSplit = fileName.split(".csv");
    if (csvSplit.length != 2) {
        return false;
    }
    if (csvSplit[csvSplit.length - 1] != "") {
        return false;
    }

    let basename = fileName.split(".csv")[0]

    // check if enough "_" are present
    if (basename.split("_").length < 3) {
        return false;
    }

    // check if date is valid
    let dateString = basename.split("_")[basename.split("_").length - 1];
    // check if dateString is a number
    if (isNaN(parseFloat(dateString))) {
        return false;
    }
    // check if dateString is an integer
    if (!Number.isInteger(parseFloat(dateString))) {
        return false;
    }
    // check if dateString has length 8
    if (dateString.length != 8) {
        return false;
    }
    return true;
}

export function objectIsEmpty(obj: any): boolean {
    // check if object is empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function unixTimeToLocalTime(unixTime: number): string {
    // convert unix time to local time
    var date = new Date(unixTime); // uses time zone of browser
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours.substring(hours.length - 2, hours.length)
        + ':' + minutes.substring(minutes.length - 2, minutes.length)
        + ':' + seconds.substring(seconds.length - 2, seconds.length);
    return formattedTime;
}

export function getDateFromFileName(fileName: string): string {
    // extract date from filename, requires filename to be in format "studyName_participantName_yyyymmdd.csv"
    return splitLogFileName(fileName).date;
}

export function getStudyFromFileName(fileName: string): string {
    return splitLogFileName(fileName).study;
}

export function getParticipantFromFileName(fileName: string): string {
    // extract participant name from filename, requires filename to be in format "carwatch_{studyName}_{participantName}_yyyymmdd.csv"
    return splitLogFileName(fileName).participant;
}

function splitLogFileName(fileName: string): {date: string, study: string, participant: string} {
    let date = "";
    let study = "";
    let participant = "";

    let basename = fileName.split(".csv")[0]

    basename = basename.replace("carwatch_","")
    basename = basename.split('\\')[basename.split('\\').length - 1];
    basename = basename.split('/')[basename.split('/').length - 1];
    let infoArray = basename.split("_")
    if (infoArray.length > 2) {
        participant = infoArray.slice(1, infoArray.length - 1).join("_");
        study = infoArray[0];
    }

    let dateString = basename.split("_")[basename.split("_").length - 1];
    let year = dateString.slice(0, 4);
    let month = dateString.slice(4, 6);
    let day = dateString.slice(6, 8);
    date = year + "-" + month + "-" + day;

    return {date, study, participant};
}
