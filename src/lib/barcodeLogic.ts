import { get } from "svelte/store";
import { barcodeProps, studyProps } from "./configStore";
import { barcodeDataArray, captionArray } from "./dataStore";

export function createBarcodes() {
    console.log("creating barcodes for " + get(studyProps).subjectList);
    let barcodeData = [];
    let captions = [];
    let startSample = get(studyProps).startSampleFromZero ? 0 : 1;
    let studyName = get(studyProps).studyName;
    for (let subject = 1; subject <= get(studyProps).numSubjects; subject++) {
        for (let day = 1; day <= get(studyProps).numDays; day++) {
            for (let sample = startSample; sample < get(studyProps).numSamples + startSample; sample++) {
                // convert sample to zero padded string with length 2
                let sampleString = sample.toString().padStart(2, '0');
                let dayString = day.toString().padStart(2, '0');
                let subjectString = subject.toString().padStart(3, '0');
                let caption = "";
                if (get(barcodeProps).addName) {
                    caption += studyName + "_";
                }
                // special case: evening sample referred to a "A"
                let sampleCaption = sample.toString();
                if (sample == get(studyProps).numSamples && get(studyProps).hasEveningSample){
                    sampleCaption = "E";
                }
                caption += get(studyProps).subjectList[subject - 1] + "_D" + day + "_S" + sampleCaption;
                captions.push(caption);
                let data = subjectString + dayString + sampleString;
                barcodeData.push(data);
            }
        }
    }

    barcodeDataArray.set(barcodeData);
    captionArray.set(captions);
    console.log(barcodeData);
    console.log(captions);
}