import { Button, Tooltip } from 'antd';
const { useEffect, useState } = wp.element
import { GenieMapProps } from '../map-props';
import { GenieHelpers } from '../utils/helpers';

const screens = ['TitleScreen', 'IntroScreen', 'OutlineScreen'];
const HeaderToolbar = GenieMapProps(({ setSidebar, sidebar, getInputs, setInput, getTemplateInputs }) => {
    const analyzedContent = sidebar.analyzedContent,
        { totalContentStats } = analyzedContent,
        score = totalContentStats.result.count;


    const [prevScreen, setPrevScreen] = useState({});
    const [showTooltip, setShowTooltip] = useState(false);
    const component = sidebar.component;

    useEffect(() => {
        /** store previous screen for toggling write for me and statistics if it is not toolbar writing */
        if (component !== 'StatisticsScreen' && !sidebar.toolbarWriting) {
            let template = screens.includes(component) ?
                'blogWizard' : sidebar.currentTemplate;
            setPrevScreen({
                component,
                template
            })
        }

    }, [sidebar.component, sidebar.currentTemplate]);
    const handleClickWrite = () => {

        /** turn of toolbar writing mode on click write for me */
        setSidebar({
            toolbarWriting: false,
            globalTemplateMode: false
        });
        /** input method to update post content for toolbar writing */
        setInput('updateContent', '')
        if (component === 'StatisticsScreen' || component === 'WriteTemplatesScreen') {
            setSidebar({
                open: true,
                component: prevScreen?.component || 'TemplateListScreen',
                currentTemplate: prevScreen?.template || sidebar.currentTemplate
            })
            return;
        }

        setSidebar({
            open: !sidebar.open,
            component: component || 'TemplateListScreen'
        })

    }
    const handleClickStat = () => {

        // if (!getInputs['competitorData'] && getInputs['searchVolume'] && !sidebar.currentPostContent) {
        //     let currentComponent = screens.includes(component) ?
        //         component : 'TitleScreen';
        //     setSidebar({
        //         statisticsScreen: {
        //             triggered: !sidebar.statisticsScreen.triggered,
        //             loading: false
        //         },
        //         open: true,
        //         component: currentComponent,
        //     })
        //     setInput('seoEnabled', true)
        //     return
        // }

        if (!sidebar.currentPostContent && getInputs['competitorData']) {
            setShowTooltip(true)
            setTimeout(() => {
                setShowTooltip(false)
            }, 2000);
        }

        if (Object.keys(sidebar.statisticsData).length === 0 || !sidebar.currentPostContent) {
            return false;
        }
        let sidebarStat = !sidebar.open;
        if (component !== 'StatisticsScreen') {
            sidebarStat = true;
        }

        setSidebar({
            open: sidebarStat,
            component: 'StatisticsScreen',
            analyzeKeyword: {
                open: false
            },
            generatedOutlines: {
                ...sidebar.generatedOutlines,
                open: false
            }
        })
    }
    /** if competitor data is available, show stat button */
    const visibleStatBtn = ((getInputs['competitorData'] || score) && getTemplateInputs?.blogWizard?.keyword)

    return (
        <>
            <Button onClick={handleClickWrite} type="primary" className='getgenie-toolbar-write-btn'>
                <span className="getgenie-icon-edit"></span>
                Write for me</Button>

            {visibleStatBtn ?
                <Tooltip placement="bottom" trigger="click"
                    title="No post content found!" visible={showTooltip}>
                    <Button onClick={handleClickStat}
                        style={{ backgroundColor: GenieHelpers.colorByStatScore(score || 0) }}
                        loading={sidebar.statisticsScreen.loading}
                        type="primary" className='getgenie-toolbar-write-btn stat'>
                        <span className="getgenie-icon-mini_1 score"></span>
                        {score}/100</Button>
                </Tooltip>
                :
                ''}
        </>
    )
}, ['setSidebar', 'setInput', 'sidebar', 'getInputs', 'getTemplateInputs']);

export default HeaderToolbar;