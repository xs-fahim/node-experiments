import { Divider, Form } from 'antd';
import GenieTextarea from '../../Textarea';
import GenieButton from '../../Button';
import GenieSlider from '../../Slider';
import GenieCard from '../../Card';
import GenieNumberInput from '../../NumberInput'
import { GenieMapProps } from '../../../map-props';
import { GenieRequestApi } from '../../../api-request';
import { GenieCollapse } from '../../Collapse';
import GenieTitleMsg from '../../TitleMsg'
import SidebarNav from '../../SidebarNav';
import { SkeletonSingle } from '../../Skeletons/SkeletonSingle';
import { DrawerHeader } from '../../DrawerHeader';
import { DrawerFooter } from '../../DrawerFooter';
import { GenieAiInfoTooltip } from '../../GenieAiInfoTooltip';
import { ContentFeedback } from '../../ContentFeedback';
import processResponse from '../../../utils/processResponse';
import { GenieHelpers } from '../../../utils/helpers';
const { useEffect, useState } = wp.element;

/**
 * @function IntroScreen
 * @type {React.FC<IntroScreen>}
 * @param {function} GenieMapProps - access properties from redux store.
 * @see {@link GenieMapProps} 
 * @returns {React.ReactElement} Intro screen of Blog Wizard
 */
const IntroScreen = GenieMapProps(({ getInputs, setInput }) => {
    const [loading, setLoading] = useState(false);

    const list = getInputs['generatedIntros'] || []

    const generateIntro = () => {

        setLoading(true);

        /**
         * @var data
         * @type {object}
         * @description data to be send to server
         * @property {string} title selected title from title screen
         * @property {number} creativity current creativity at input slider
         * @property {number} numberOfResult maximum number of contents to be generated
         */
        let data = {
            title: getInputs['selectedTitle'],
            context: getInputs['inputContext'],
            creativity: getInputs['introCreativityLevel'],
            numberOfResult: getInputs['introResultLimit']
        }

        /** clearing previous data */
        setInput('generatedIntros', []);

        GenieRequestApi.writeIntro((res) => {
            setLoading(false);

            processResponse(res, () => {
                let intros = res.data.map((item) => {
                    /**  
                     * adding extra properties for feedback feature
                     * template slug is used for unique identification, update it later
                     */
                    return { title: item, like: false, dislike: false }
                })
                setInput('generatedIntros', intros);

                /** store these intros in database */
                GenieHelpers.callStoreApi('generatedIntros', intros);
            })
        }, data);
    }
    /**
     * @function handleClick
     * @param {event} e value  event properties of clicked item
     * @param {object} item value of the clicked item
     */
    const handleClick = (e, item) => {
        /** update selected intro */
        setInput('selectedIntro', item.title);
    }

    /** 
     * @name IntroScreen-useEffect
     * @description store data to database on input change 
     */
    useEffect(() => GenieHelpers.storeData('introCreativityLevel'), [getInputs['introCreativityLevel']]);

    return (
        <>
            <DrawerHeader />
            <SidebarNav navigation="intro" />
            <Divider />
            <div className='getgenie-title-form'>
                <Form layout="vertical" onFinish={generateIntro}>
                    <div className="getgenie-screen-content intro">
                        <GenieCollapse defaultActiveKey={['generated-content']} className="getgenie-collapse">
                            <GenieCollapse.Panel header="Title" key="generated-content">
                                <GenieTextarea name='selectedTitle' type="text" placeholder="Type your title" required={true} errorMessage="Please enter the title here" />
                            </GenieCollapse.Panel>
                        </GenieCollapse>

                        <GenieSlider name='introCreativityLevel' label={<>Creativity Level <GenieAiInfoTooltip title="How much creative you want genie to be" placement={"top"}>i</GenieAiInfoTooltip></>} message={false} defaultValue={4} />
                        <GenieNumberInput name='introResultLimit' max={10} type="text" defaultValue={2} label={<>Set Result Limit <GenieAiInfoTooltip title={"Maximum content you want to generate"} placement={"top"}>i</GenieAiInfoTooltip></>} required={true} errorMessage="Please enter the title here" />

                        <GenieButton htmlType="submit" type="primary" className="submit-btn" loading={loading}>
                            <span className="getgenie-icon-edit"></span>
                            Generate Intro</GenieButton>
                    </div>
                    <GenieTitleMsg list={list} loading={loading} title="intro" />

                    <div className="getgenie-card-container getgenie-title-cards" style={{ backgroundColor: list.length === 0 && "transparent" }}>
                        {/** turning on showActiveItem and the value of previously selected intro to select the content */}
                        <GenieCard showActiveItem={true} value={getInputs['selectedIntro']} list={list} handleClick={handleClick} skeleton={loading ? () => <SkeletonSingle count={10} /> : ''}>{
                            (item) => (
                                <>
                                    <h5 className='generated-content'>
                                        {item.title}
                                    </h5>
                                    <ContentFeedback content={item}
                                        input={getInputs['selectedTitle']}
                                        creativityLevel={getInputs['introCreativityLevel']}
                                        listName='generatedIntros' />
                                </>
                            )
                        }</GenieCard>
                    </div>
                </Form>
                {/** enable next button if selected intro is in current generatedIntros list */}
                <DrawerFooter prevScreen='TitleScreen' nextScreen='OutlineScreen' enableNextBtn={!!list.find(item => item.title === getInputs['selectedIntro'])} />
            </div>
        </>
    )
}, ['getInputs', 'setInput']);

export { IntroScreen }