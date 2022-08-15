import { GenieHelpers } from "../utils/helpers";
import { userListUrl, competitorDataUrl, countryListUrl, contentFeedbackUrl, templateUrl, continueWritingUrl, expandOutlineUrl, keywordDoctorUrl, getLicenseTokenUrl, removeLicenseTokenUrl, limitUsageUrl, generateTitleURL, generateIntroURL, generateOutlineURL, getHistoryUrl } from "./endpoints";

class RequestApi {
    /** generate content with different type of templates */
    writeTemplates = (callback, params) => {
        GenieHelpers.callApi(templateUrl, (result) => {
            callback(result);
        }, params)
    }
    /** fetch intros for intro screen */ 
    writeIntro = (callback, params) => {
        GenieHelpers.callApi(generateIntroURL, (result) => {
            callback(result);
        }, params)
    }
    /** fetch titles for intro screen */ 
    writeTitle = (callback, params) => {
        GenieHelpers.callApi(generateTitleURL, (result) => {
            callback(result);
        }, params)
    }
    /** wp users list */ 
    userList = (callback, params) => {
        GenieHelpers.callApi(userListUrl,
            (result) => {
                callback(result);
            }, params)
    }
    countryList = (callback, params) => {
        GenieHelpers.callApi(countryListUrl,
            (result) => {
                callback(result);
            }, params)
    }
    historyData = (callback, params) => {
        GenieHelpers.callApi(getHistoryUrl,
            (result) => {
                callback(result);
            }, params)
    }
    /** for content re-write */ 
    paraphraseText = (callback, params) => {
        GenieHelpers.callApi(templateUrl,
            (result) => {
                callback(result);
            }, params)
    }
    /** continue writing */ 
    continueWriting = (callback, params) => {
        GenieHelpers.callApi(continueWritingUrl,
            (result) => {
                callback(result);
            }, params)
    }

    /** expand outline */ 
    expandOutline = (callback, params) => {
        GenieHelpers.callApi(expandOutlineUrl,
            (result) => {
                callback(result);
            }, params)
    }

    /** analyze keyword data. e.g.- search volume, charts */
    keywordsData = (callback, params) => {
        GenieHelpers.callApi(keywordDoctorUrl,
            (result) => {
                callback(result);
            }, params)
    }
    /** get competitors data. page url, html .... */
    competitorData = (callback, params) => {
        GenieHelpers.callApi(competitorDataUrl,
            (result) => {
                callback(result);
            }, params)
    }
    /** get outlines for generated outline panel */ 
    outlines = (callback, params) => {
        GenieHelpers.callApi(generateOutlineURL,
            (result) => {
                callback(result);
            }, params)
    }
    /** store feedback- like/dislike */ 
    contentFeedback = (callback, params) => {
        GenieHelpers.callApi(contentFeedbackUrl,
            (result) => {
                callback(result);
            }, params)
    }

    /** license token */ 
    getLicenseToken = (callback, params) => {
        GenieHelpers.callApi(getLicenseTokenUrl,
            (result) => {
                callback(result);
            }, params)
    }
    removeLicenseToken = (callback, params) => {
        GenieHelpers.callApi(removeLicenseTokenUrl,
            (result) => {
                callback(result);
            }, params)
    }

    /** get user stats for license token */
    limitUsage = (callback, params) => {
        GenieHelpers.callApi(limitUsageUrl,
            (result) => {
                callback(result);
            }, params)
    }
}

const GenieRequestApi = new RequestApi();
export { GenieRequestApi };