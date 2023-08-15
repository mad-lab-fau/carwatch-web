import JSZip from 'jszip';
import Papa from 'papaparse';
import { load } from '../../routes/+page';


export async function extractZip(files: FileList): Promise<[]> {
    return new Promise<[]>(async (resolve, reject) => {
        const zip = new JSZip();
        let zipData: any = [];
        let loadedFiles: string[] = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            console.log("file: " + file.name);
            // Read the file content as an ArrayBuffer
            const arrayBuffer = await readFileAsArrayBuffer(file);

            // Load the zip file
            const loadedZip = await zip.loadAsync(arrayBuffer);

            let fileNames: string[] = [];
            loadedZip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir && !loadedFiles.includes(zipEntry.name)) {
                    // todo: sanity check of file name
                    fileNames.push(zipEntry.name);
                    // sort file names alphabetically => participant names and dates are ordered
                }
            });
            // sort file names alphabetically => participant names and dates are ordered
            fileNames.sort();
            console.log("fileNames: " + fileNames);
        

            await Promise.allSettled(
                fileNames.map(async (fileName) => {
                    const file = loadedZip.file(fileName);
                    if (file) {
                        loadedFiles.push(fileName);
                        const fileContent = await file.async('string');
                        let zipEntryContent = { name: "", data: [] };
                        zipEntryContent.name = fileName;
                        zipEntryContent.data = Papa.parse(
                            fileContent,
                            { delimiter: ";", newline: "\n", skipEmptyLines: true }
                        ).data;
                        zipData.push(zipEntryContent);
                    }
                })
            );
            }
        // todo: reject if zipData is empty or other error occurs
        resolve(zipData);
    });

}

// Helper function to read a File as an ArrayBuffer
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
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


export function objectIsEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function unixTimeToLocalTime(unixTime: number): string {

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
    let basename = fileName.split(".csv")[0]
    let dateString = basename.split("_")[basename.split("_").length - 1];
    let year = dateString.slice(0, 4);
    let month = dateString.slice(4, 6);
    let day = dateString.slice(6, 8);
    return year + "-" + month + "-" + day;
}

export function getSubjectFromFileName(fileName: string): string {
    let subjectName = "";
    let basename = fileName.split(".csv")[0]
    let infoArray = basename.split("_") //[basename.split("_").length-1];
    if (infoArray.length > 2) {
        subjectName = infoArray.slice(1, infoArray.length - 1).join("_");
    }
    return subjectName;
}
