import { Form, Divider } from 'antd';
import GenieInput from '../../Input';
import GenieButton from '../../Button';
import GenieSlider from '../../Slider';
import GenieCard from '../../Card';
import GenieNumberInput from '../../NumberInput'
import GenieTitleMsg from '../../TitleMsg'
import { GenieMapProps } from '../../../map-props';
import { GenieRequestApi } from '../../../api-request';
import SidebarNav from '../../SidebarNav';
import GenieAiSwitch from '../../GenieAiSwitch';
import { GenieSelect } from '../../Select';
import { SkeletonSingle } from '../../Skeletons/SkeletonSingle';
import { DrawerHeader } from '../../DrawerHeader';
import { DrawerFooter } from '../../DrawerFooter';
import { GenieAiInfoTooltip } from '../../GenieAiInfoTooltip';
import { ContentFeedback } from '../../ContentFeedback';
import processResponse from '../../../utils/processResponse';
import { GenieHelpers } from '../../../utils/helpers';
import GenieTextarea from '../../Textarea';
const { useEffect, useState } = wp.element;
const TitleScreen = GenieMapProps(({ sidebar, setSidebar, getInputs, setInput }) => {
    const demoCountries = [
        { label: 'United States (USA)', value: '2840' },
        { label: 'United Kingdom', value: '2826' },
        { label: 'Bangladesh', value: '2050' },
        { label: 'India', value: '2356' },
    ]
    const [countries, setCountries] = useState(demoCountries);
    const [loading, setLoading] = useState(false);
    const list = getInputs['generatedTitles'] || []
    const seoEnabled = getInputs['seoEnabled'] || false
    const [countryLoading, setCountryLoading] = useState(false);
    const keywordAnalyzing = sidebar.analyzingSearchVolume || sidebar.analyzingRelatedKeyword;

    useEffect(() => {
        /** turn on seo mode at first open */
        if (!getInputs['searchVolume']) {
            setInput('seoEnabled', true)
        }
    }, []);

    const generateTitle = () => {

        setLoading(true);
        /** remove special characters from body data */
        let data = {
            keyword: (getInputs['keyword'] || '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, ''),
            context: getInputs['inputContext'],
            creativity: getInputs['titleCreativityLevel'],
            numberOfResult: getInputs['titleResultLimit']
        }

        /** clearing previous data */
        setInput('generatedTitles', [])

        GenieRequestApi.writeTitle((res) => {
            setLoading(false);
            processResponse(res, () => {
                let titles = res.data.map((item) => {
                    /** adding extra attributes for feedback feature */
                    return { title: item, like: false, dislike: false }
                })
                /** set title list in redux store */
                setInput('generatedTitles', titles);
                /** save title list in db */
                GenieHelpers.callStoreApi('generatedTitles', titles);
            })
        }, data);
    }

    const analyzeData = () => {

        /** 
         * @description trigger the api call if current input keyword or country is not used in previous call.
         *  @description Duplicate calling is restricted here  */
        if ((getInputs['keyword'] !== getInputs['searchVolume']?.keyword) || (getInputs['selectedCountry'] !== getInputs['searchVolume']?.country)) {

            /** clearing previous data before analyze current input keyword */
            setInput('searchVolume', '')
            setInput('relatedKeywords', '')
            setInput('competitorData', '')
            setInput('questionsAsked', '')

            /** 
             * @description turn on analyze keyword panel
             * @description set two loading property as active for search volume and related keyword 
             * @description api is called from SeoData/Keywords/index.js
             */

            setSidebar({
                analyzeKeyword: {
                    open: true
                },
                analyzingSearchVolume: true,
                analyzingRelatedKeyword: true
            })
        }
    }

    const handleClick = (e, item) => {
        setInput('selectedTitle', item.title);
    }

    const fetchCountryList = input => {

        GenieRequestApi.countryList((res) => {
            setCountryLoading(false)

            processResponse(res, () => {
                /** api is providing all countries, so filter out desired items according to input */
                let filteredList = res.filter(item => {
                    if (item.location_name.toLowerCase().includes(input.toLowerCase()))
                        return item
                });
                /** creating array of objects with label value pair */
                filteredList = filteredList.map(item => ({ label: item.location_name, value: item.location_code }))
                let updatedCountries = [...countries, ...filteredList]
                /** make the list of unique items */
                updatedCountries = updatedCountries.filter((item, index, array) => {
                    return array.findIndex(t => t.value == item.value && t.label == item.label) == index
                });
                setCountries(updatedCountries)
            })
            

        }, {});
    }

    let countryTimeout;

    const handleOnSearchCountry = input => {

        setCountryLoading(true)
        /** added throtling to solve multiple triggering issue */
        if (countryTimeout) {
            clearTimeout(countryTimeout)
        }

        countryTimeout = setTimeout(() => {
            fetchCountryList(input)
        }, 3000)

    }


    useEffect(() => {
        /** storing data to database on input change */
        GenieHelpers.storeData('keyword')
        /** updated wp post excerpt based on input keyword */
        wp.data.dispatch('core/editor').editPost({ excerpt: getInputs["keyword"] })
    }, [getInputs['keyword']])

    useEffect(() => GenieHelpers.storeData('seoEnabled'), [getInputs['seoEnabled']])
    useEffect(() => GenieHelpers.storeData('selectedCountry'), [getInputs['selectedCountry']])
    useEffect(() => GenieHelpers.storeData('titleCreativityLevel'), [getInputs['titleCreativityLevel']])
    useEffect(() => GenieHelpers.storeData('selectedTitle'), [getInputs['selectedTitle']]);

    return (
        <>
            <DrawerHeader />
            <SidebarNav navigation="title" />

            <Divider />

            <div className='getgenie-title-form'>
                <Form layout="vertical" onFinish={generateTitle}>
                    <div className="getgenie-screen-content title">
                        <GenieInput name="keyword" type="text"
                            label="Keyword"
                            placeholder="Enter Your Keyword here"
                            required={true} errorMessage="Please enter the title here" />

                        <GenieTextarea label="Context (Optional)" name="inputContext" rows={4}
                            placeholder="Enter a context for the keyword" />

                        <Divider />
                        <GenieAiSwitch label="SEO Mode" defaultChecked={seoEnabled} name='seoEnabled' />

                        {seoEnabled && <GenieSelect name="selectedCountry" loading={countryLoading} onSearch={handleOnSearchCountry} className="selectedCountry" defaultValue={countries[0].value} options={countries} />}

                        {seoEnabled && <GenieButton onClick={analyzeData} className="getgenie-analyze-btn" type="primary"
                            loading={keywordAnalyzing} disabled={!getInputs.keyword}>
                            Analyze keyword</GenieButton>}
                        <Divider />

                        <GenieSlider name="titleCreativityLevel"
                            label={<>Creativity Level
                                <GenieAiInfoTooltip title="How much creative you want genie to be" placement="top"></GenieAiInfoTooltip></>}
                            message={false}
                            defaultValue={4} />

                        <GenieNumberInput name="titleResultLimit" type="text" defaultValue={2}
                            max={10}
                            label={<>Set Result Limit <GenieAiInfoTooltip title="Maximum content you want to generate" placement="top" /></>}
                            required={true} />

                        <GenieButton htmlType="submit" className="submit-btn" type="primary" loading={loading} disabled={!getInputs.keyword}>
                            <span className="getgenie-icon-edit"></span>
                            Generate title</GenieButton>
                    </div>
                    <GenieTitleMsg list={list} loading={loading} title="title" />
                    <div className="getgenie-card-container getgenie-title-cards" style={{ backgroundColor: list.length === 0 && "transparent" }}>
                        <GenieCard showActiveItem={true} value={getInputs['selectedTitle']} list={list} handleClick={handleClick} column={1} skeleton={loading ? () => <SkeletonSingle count={10} /> : ''}>{
                            (item) => (
                                <>
                                    <h5 className='generated-content'>
                                        {item.title}
                                    </h5>
                                    <ContentFeedback content={item}
                                        input={getInputs['keyword']}
                                        creativityLevel={getInputs['titleCreativityLevel']} listName='generatedTitles' />
                                </>
                            )
                        }</GenieCard>
                    </div>
                </Form>

                <DrawerFooter prevScreen='TemplateListScreen' nextScreen='IntroScreen' enableNextBtn={!!list.find(item => item.title === getInputs['selectedTitle'])} />
            </div>
        </>
    )
}, ['setSidebar', 'getInputs', 'setInput', 'sidebar']);

export { TitleScreen }