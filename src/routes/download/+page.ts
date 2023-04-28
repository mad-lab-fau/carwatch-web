import { barcodePropsValid, qrCodePropsValid, studyPropsValid } from '$lib/configStore';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { barcodeDataArray, captionArray } from '$lib/dataStore';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const load = (async () => {
    if (!(studyPropsValid && barcodePropsValid && qrCodePropsValid)) {
    //    if(browser && sessionStorage){
    //         sessionStorage.setItem("download_redirect", "1");
    //     }
        throw redirect(302, '/preparation');
    }
    console.log("on load:", get(barcodeDataArray));
    if (get(barcodeDataArray) === undefined || get(barcodeDataArray).length == 0 || get(captionArray) === undefined || get(captionArray).length == 0) {
        // if(browser && sessionStorage){
        //     sessionStorage.setItem("download_redirect", "1");
        // }
        throw redirect(302, '/preparation');
    }
    return {};
}) satisfies PageLoad;