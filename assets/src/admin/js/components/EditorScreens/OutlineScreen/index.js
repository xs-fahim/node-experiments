import { Alert, Form, Divider } from 'antd';
import GenieButton from '../../Button';
import GenieSlider from '../../Slider';
import GenieTextarea from '../../Textarea';
import GenieNumberInput from '../../NumberInput';
import { GenieMapProps } from '../../../map-props';
import { GenieRequestApi } from '../../../api-request';
import { GenieCollapse } from '../../Collapse';
import GenieTitleMsg from '../../TitleMsg'
import SidebarNav from '../../SidebarNav';
import { DrawerHeader } from '../../DrawerHeader';
import { DrawerFooter } from '../../DrawerFooter';
import { GenieAiInfoTooltip } from '../../GenieAiInfoTooltip';
import { SelectedOutlines } from './SelectedOutlines';
import processResponse from '../../../utils/processResponse';
import { confirmModal } from '../../../utils/ConfirmModal';
import { GenieHelpers } from '../../../utils/helpers';
const { useEffect, useState } = wp.element;

/**
 * @function OutlineScreen
 * @type {React.FC<OutlineScreen>}
 * @param {function} GenieMapProps - access properties from redux store.
 * @see {@link GenieMapProps} 
 * @returns {React.ReactElement} Outline screen of Blog Wizard
 */

const OutlineScreen = GenieMapProps(({ setSidebar, sidebar, getInputs, setInput }) => {
    const loading = sidebar.generatedOutlines.loading;

    /**
     * check if any outline is selected and then make the array of unique values
     * if selectedOutline is not defined yet then assign empty array
     */
    const selectedOutlines = getInputs['selectedOutlines'] ? [...(new Set(getInputs['selectedOutlines']))] : []

    const [visibleAlert, setVisibleAlert] = useState(true)

    useEffect(() => {
        /** store initial values to db */
        GenieHelpers.callStoreApi('selectedTitle', getInputs['selectedTitle']);
        GenieHelpers.callStoreApi('selectedIntro', getInputs['selectedIntro']);
    }, []);

    const onFinish = () => {

        /**
         * @var data
         * @type {object}
         * @description data to be send to server
         * @property {string} title selected title from title screen
         * @property {number} creativity current creativity at input slider
         * @property {number} numberOfResult maximum number of contents to be generated
         * @property {string} intro selected intro from intro screen
         */
        let data = {
            title: getInputs['selectedTitle'],
            context: getInputs['inputContext'],
            intro: getInputs['selectedIntro'],
            creativity: getInputs['outlineCreativityLevel'],
            numberOfResult: getInputs['outlineResultLimit']
        }
        /** clearing previous generated outlines */
        setInput('generatedOutlines', '');

        /** open the generated outline panel */
        setSidebar({
            generatedOutlines: {
                open: true,
                loading: true,
            }
        })
        GenieRequestApi.outlines((res) => {
            setSidebar({
                generatedOutlines: {
                    open: true,
                    loading: false,
                }
            });

            processResponse(res, () => {
                setInput('generatedOutlines', res.data);
                setInput('seoEnabled', true); /** opening seo tab */
                /** save outlines to db */
                GenieHelpers.callStoreApi('generatedOutlines', res.data);
            })
        }, data);
    }

    useEffect(() => {
        if (getInputs['generatedOutlines']) {
            setSidebar({
                generatedOutlines: {
                    ...sidebar.generatedOutlines,
                    open: true
                }
            });
            /** opening seo tab at initial if generated outlines are available */
            setInput('seoEnabled', true);
        }
    }, [])

    /**
     * @function insertTitleIntro
     * @description insert title in wp post title field
     * @description insert intro in wp post excerpt field
     */
    const insertTitleIntro = (intro) => {
        wp.data.dispatch('core/editor').editPost({ title: getInputs['selectedTitle'] })

        wp.data.dispatch('core/editor').editPost({
            excerpt: intro
        })
    }
    const insertOutlineAsHeading = (intro) => {
        /** remove all content */
        wp.data.dispatch('core/editor').resetBlocks(wp.blocks.parse(''));

        /** add selected intro at beginning of the post */
        wp.data.dispatch("core/editor").insertBlocks(
            wp.blocks.createBlock("core/paragraph", {
                content: intro
            })
        );

        selectedOutlines.forEach(item => {
            /** insert all selected outlines as headings. default- h2 */
            wp.data.dispatch("core/editor").insertBlocks(
                wp.blocks.createBlock("core/heading", {
                    content: item
                })
            );
        })
        setSidebar({
            open: false
        })
    }


    const handleInsertData = () => {
        /** remove br tags */
        const selectedIntro = (getInputs['selectedIntro'] || '').replace(/<br\s*[\/]?>/g, "")

        /** check if post has some content, then ask before insert something */
        if (wp.data.select('core/editor').getEditedPostContent()) {
            confirmModal('This page has some content', 'Do you want to replace that?',
                () => {
                    insertTitleIntro(selectedIntro);
                    insertOutlineAsHeading(selectedIntro);
                })
        }
        else {
            insertTitleIntro(selectedIntro);
            insertOutlineAsHeading(selectedIntro);
        }
    }

    /** store data to database on input change */
    useEffect(() => GenieHelpers.storeData('selectedIntro'), [getInputs['selectedIntro']]);
    useEffect(() => GenieHelpers.storeData('outlineCreativityLevel'), [getInputs['outlineCreativityLevel']]);

    /** show alert for modification of outlines */
    useEffect(() => {
        if (selectedOutlines.length > 1) {
            setTimeout(() => {
                setVisibleAlert(false)
            }, 5000)
        }
        GenieHelpers.storeData('selectedOutlines');

    }, [getInputs['selectedOutlines']])


    return (
        <>
            <DrawerHeader />

            <SidebarNav navigation="outline" />

            <Divider />
            <div className='getgenie-sidebar-outline'>
                <Form layout="vertical" onFinish={onFinish}>
                    <div className="getgenie-screen-content intro">
                        <GenieCollapse defaultActiveKey={['Title-Intro']} className="getgenie-collapse">
                            <GenieCollapse.Panel header="Title & Intro" key="Title-Intro">
                                <GenieTextarea rows={2} name='selectedTitle' type="text" placeholder="Type your title" />
                                <GenieTextarea rows={6} name='selectedIntro' placeholder="Type intro" />
                            </GenieCollapse.Panel>
                        </GenieCollapse>

                        <GenieSlider name='outlineCreativityLevel' label={<>Creativity Level <GenieAiInfoTooltip title={"How much creative you want genie to be"} placement={"top"}>i</GenieAiInfoTooltip></>} message={false} defaultValue={4} />

                        <GenieNumberInput name='outlineResultLimit' type="text" defaultValue={2}
                            max={10}
                            label={<>Set Result Limit <GenieAiInfoTooltip title="Maximum content you want to generate" placement="top" /></>}
                            required={true} />
                        <GenieButton htmlType="submit" type="primary" className="submit-btn" loading={loading}>
                            <span class="getgenie-icon-edit"></span>
                            Generate Outline</GenieButton>
                    </div>
                    <GenieTitleMsg list={selectedOutlines} loading={loading} title="outline" />

                    <div className="getgenie-card-container getgenie-outline-cards">
                        {selectedOutlines.length === 0 && sidebar.generatedOutlines.open &&
                            <span className="getgenie-outline-loading-text">Selected Outlines will Appear here</span>
                        }

                        <SelectedOutlines />

                        {selectedOutlines.length > 1 && visibleAlert && <Alert
                            className="getgenie-outline-cards-alert"
                            message="You can also Edit, Delete & Rearrange these Selected Outlines"
                            closeText="Okay"
                            closable
                        />}
                    </div>

                </Form>

                <DrawerFooter prevScreen='IntroScreen' enableWriteBtn={selectedOutlines.length > 0}
                    insertData={handleInsertData} />
            </div>

        </>
    )
}, ['setSidebar', 'sidebar', 'getInputs', 'setInput']);

export { OutlineScreen }