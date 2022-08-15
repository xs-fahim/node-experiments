import { Button, Divider, Radio } from "antd"
const { useEffect, useState } = wp.element;
import { GenieRequestApi } from "../../api-request"
import { GenieMapProps } from "../../map-props"
import { GenieHelpers } from "../../utils/helpers";
import processResponse from "../../utils/processResponse";
import WebSourceAnalysis from "../../utils/websourceAnalysis";
import { Competitor } from "./Competitor"
import { Keywords } from "./Keywords"
import { QuestionsAsked } from "./QuestionsAsked"

const SeoData = GenieMapProps(({ sidebar, getInputs, setInput, setSidebar }) => {

    const [currentTab, setCurrentTab] = useState('keywords')
    const [callable, setCallable] = useState(true)
    const [loadingText, setLoadingText] = useState('')
    const keywordAnalyzing = sidebar.analyzingSearchVolume || sidebar.analyzingRelatedKeyword;

    let fetchedData = false, error = false;

    useEffect(() => {
        /** if search volume data exist and outline screen is opened, show competitor panel */
        if (Object.keys(getInputs['searchVolume'] || {})?.length && sidebar.component === 'OutlineScreen') {
            setCurrentTab('competitor');
        }
    }, [getInputs['generatedOutlines']]) /** triggers from outline screen */

    useEffect(() => {
        /** if no competitor data but clicked on statistics button, then open competitor panel */
        if (!getInputs['competitorData'] && getInputs['searchVolume']) {
            setCurrentTab('competitor')
        }
    }, [sidebar.statisticsScreen.triggered]) /** triggers from HeaderToolbar */

    const waitFor = delay => new Promise(resolve => {
        /** if state value is true, resolve the promise */
        if (fetchedData) {
            delay = 500;
        }
        if (error) {
            resolve()
        }
        setTimeout(resolve, delay)
    });

    async function showLoadingText() {
        setLoadingText('Fetching SERP data');
        await waitFor(5000);
        setLoadingText('Fetching questions');
        await waitFor(5000);
        for await (const content of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
            /** setLoadingText(`Fetching competitor websites (${content}/10)`); */
            setLoadingText(`Fetching competitor websites`);
            await waitFor(3000);
        }
        setLoadingText('Analyzing...')

        if (error) {
            setLoadingText('')
        }
    }

    const fetchCompetitorData = () => {
        /** prevent repeated calls */
        if (!callable || currentTab === 'keywords') {
            return
        }

        if (!getInputs['competitorData'] && getInputs['relatedKeywords']) {

            setCallable(false)

            let data = {
                keyword: getInputs['keyword'],
                context: getInputs['inputContext'],
                location: getInputs['selectedCountry']
            }

            fetchedData = false;
            error = false;
            showLoadingText()

            GenieRequestApi.competitorData((res) => {

                if (res?.networkErr || res?.status !== 'success') {
                    error = true
                    setLoadingText('')
                }

                processResponse(res, () => {
                    let keywords = (getInputs['relatedKeywords'] || []);
                    /** check if related keywords are inside objects, then create array of keywords */
                    if (keywords.every(i => (typeof i !== "string"))) {
                        keywords = keywords.map(rel => rel?.keyword || '');
                    }

                    /** get analysis data based on competitor data and related keywords */
                    const scrape = new WebSourceAnalysis(res.data.competitor, keywords)

                    let data = scrape.scrapping();

                    setSidebar({
                        statisticsData: data.stat || {}
                    });
                    setInput('competitorData', data.content)
                    setInput('questionsAsked', res.data.question)

                    /** save response to db */
                    GenieHelpers.callStoreApi('serpData', {
                        competitorData: data.content,
                        questionsAsked: res.data.question,
                        statisticsData: data.stat
                    });
                    fetchedData = true
                    setCallable(true)
                    setSidebar({
                        statisticsScreen: {
                            loading: false
                        }
                    })
                });

                if (res.status !== 'success') {
                    fetchedData = true
                    setCallable(true)
                    setSidebar({
                        statisticsScreen: {
                            loading: false
                        }
                    })
                }
            }, data);

        }
    }
    /** wait few times for Analyze state after fetching competitor is done */
    useEffect(async () => {
        if (getInputs['competitorData'] && loadingText == 'Analyzing...') {
            await waitFor(2000)
            setLoadingText('')
        }

    }, [loadingText, getInputs['competitorData']])

    /** if fetching search volume is complete, open keywords tab */
    useEffect(() => {
        if (!getInputs['searchVolume']) {
            setCurrentTab('keywords')
        }
        /** clear loading state if search volume changed */
        setLoadingText('')
    }, [getInputs['searchVolume']])

    /** open competitor tab when click on statistics button */
    useEffect(() => {
        if (sidebar.statisticsScreen.clicked) {
            setCurrentTab('competitor')
        }
    }, [sidebar.statisticsScreen.clicked])

    let initialState = (!getInputs['competitorData'] && !loadingText) ? <Button onClick={fetchCompetitorData}>Fetch Data</Button> : loadingText;

    return (
        <div className="getgenie-seo-keyword-tab">
            <div className="genie-nav-container">
                <Radio.Group value={currentTab} onChange={e => setCurrentTab(e.target.value)}>
                    <Radio.Button value='keywords'>Keywords</Radio.Button>
                    <Radio.Button disabled={keywordAnalyzing} value='competitor'>Competitor</Radio.Button>
                    <Radio.Button disabled={keywordAnalyzing} value='questions'>Questions Asked</Radio.Button>
                </Radio.Group>
            </div>
            <Divider />
            <div className="getgenie-seo-container">
                {currentTab === 'keywords' && <Keywords />}
                {currentTab === 'competitor' && <Competitor loading={initialState} />}
                {currentTab === 'questions' && <QuestionsAsked loading={initialState} />}
            </div>
        </div>
    )
}, ['getInputs', 'sidebar', 'setInput', 'setSidebar']);

export { SeoData }