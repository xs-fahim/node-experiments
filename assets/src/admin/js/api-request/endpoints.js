/** user and country list endpoints for temporary use */
export const userListUrl = 'https://raw.githubusercontent.com/xs-salekin/data-store/main/user_list.json'
export const countryListUrl = 'https://raw.githubusercontent.com/xs-salekin/data-store/main/countries.json'


/** domain address located in getgenie.php */

const allUrls = window.getGenie.config;

const parserApiUrl = allUrls.parserApi;

export const getHistoryUrl = allUrls.historyApi + 'list';
export const createHistoryUrl = allUrls.historyApi + 'create';

export const templateUrl = parserApiUrl + 'writer-default/generate-templates-content';
export const generateTitleURL = parserApiUrl + 'writer-wizard/generate-title';
export const generateIntroURL = parserApiUrl + 'writer-wizard/generate-intro';
export const generateOutlineURL = parserApiUrl + 'writer-wizard/generate-outline';

export const keywordDoctorUrl =  parserApiUrl + 'writer-wizard/keyword-doctor';
export const competitorDataUrl =  parserApiUrl + 'writer-wizard/serp-data';

export const continueWritingUrl =  parserApiUrl + 'advanced-writing/continue-writing';
export const expandOutlineUrl =  parserApiUrl + 'advanced-writing/outline-expand';

export const contentFeedbackUrl = allUrls.feedbackApi;

export const storeApiUrl = allUrls.storeApi + window.getGenie.blogWizardData?.post_id;

const licenseApiUrl = allUrls.licenseApi;

export const getLicenseTokenUrl =  licenseApiUrl + 'get-token';
export const removeLicenseTokenUrl =  licenseApiUrl + 'remove-token';
export const limitUsageUrl =  allUrls.usageLimitStatsApi;

