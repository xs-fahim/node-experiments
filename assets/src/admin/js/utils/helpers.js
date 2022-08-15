import { TemplateListScreen } from "../components/EditorScreens/TemplateListScreen";
import { WriteTemplatesScreen } from "../components/EditorScreens/WriteTemplatesScreen";
import { TitleScreen } from "../components/EditorScreens/TitleScreen";
import { IntroScreen } from "../components/EditorScreens/IntroScreen";
import { OutlineScreen } from "../components/EditorScreens/OutlineScreen";
import { StatisticsScreen } from "../components/StatisticsScreen";
import { storeApiUrl } from "../api-request/endpoints";

class Helpers {
    components = {
        TemplateListScreen,
        WriteTemplatesScreen,
        TitleScreen,
        IntroScreen,
        OutlineScreen,
        StatisticsScreen
    }

    storeTimeout = {}; // using throttling timer in storeData function

    async callApi(url, result, data = '') {
        const config = window.getGenie.config;

        if (!config?.authToken || config?.authToken === 'access_denied') {
            result({ message: ['Access Denied!'] })
            return
        }

        let params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Site-Token': config?.siteToken || '',
                'Auth-Token': config?.authToken || '',
                'X-WP-Nonce': config?.restNonce || ''
            }
        }
        if (data) {
            params.body = JSON.stringify(data)
        }

        const response = await fetch(url, params)
            .catch(err => result({ networkErr: true, message: [err?.message] || ['Failed to fetch'] }));
        if (!response) {
            return
        }

        if (response.ok) {
            try {
                const res = await response.json();
                result(res)
            }
            catch (e) {
                console.log('Something went wrong.', e);
            }
        }
        else {
            const err = await response.text()
            result({ networkErr: true, error: err })
        }
    }

    callStoreApi(name, data) {

        const url = storeApiUrl + '/' + name + '/';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'X-WP-Nonce': window.getGenie.config?.restNonce || ''
            },
        });
    }

    storeData = (name) => {

        if (this.storeTimeout[name]) {
            clearTimeout(this.storeTimeout[name]);
        }

        this.storeTimeout[name] = setTimeout(() => {
            const inputs = wp.data.select('genie').getInputs();
            this.callStoreApi(name, inputs[name] || '')
        }, 3000)
    }

    colorByStatScore = (score) => {
        let color = '#FF4131';

        if (score > 25 && score <= 50) {
            color = '#FDC500';
        }
        else if (score > 50 && score < 80) {
            color = '#84C300';
        }
        else if (score >= 80) {
            color = '#00B81D';
        }

        return color;
    }

    copyToClipboard(copyAbleText) {
        // navigator clipboard api needs a secure context (https)
        if (navigator?.clipboard && window?.isSecureContext) {
            return navigator.clipboard.writeText(copyAbleText);
        } else {
            let textArea = document.createElement("textarea");
            textArea.value = copyAbleText;


            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();
            return new Promise((resolve, reject) => {
                document.execCommand('copy') ? resolve() : reject();
                textArea.remove();
            });
        }
    }
}

const GenieHelpers = new Helpers

export { GenieHelpers }