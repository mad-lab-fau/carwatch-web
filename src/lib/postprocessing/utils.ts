import JSZip from 'jszip';
import Papa from 'papaparse';


export async function extractZip(files: FileList): Promise<[]> {
    return new Promise<[]>(async (resolve, reject) => {
        const zip = new JSZip();
        let zipData: any = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            // Read the file content as an ArrayBuffer
            const arrayBuffer = await readFileAsArrayBuffer(file);

            // Load the zip file
            const loadedZip = await zip.loadAsync(arrayBuffer);
          
            let fileNames: string[] = [];
            loadedZip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir) {
                    // todo: sanity check of file name
                    fileNames.push(zipEntry.name);
                    // sort file names alphabetically => participant names and dates are ordered
                    fileNames.sort();
                }
            });

            await Promise.allSettled(
                fileNames.map(async (fileName) => {
                    const file = loadedZip.file(fileName);
                    if(file){
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