import { barcodePropsValid, qrCodePropsValid, studyPropsValid } from '$lib/configStore';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
    if (!(studyPropsValid && barcodePropsValid && qrCodePropsValid)){
        throw redirect(302, '/preparation');
    }
    return {};
}) satisfies PageLoad;