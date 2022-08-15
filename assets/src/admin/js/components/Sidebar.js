import Col from "antd/lib/col";
import { GenieHelpers } from "../utils/helpers";
import { GenieMapProps } from "../map-props";
import { AnalyzeKeywordScreen } from "./AnalyzeKeywordScreen";
import { DrawerWrapper } from "./DrawerWrapper";
import { GeneratedOutlines } from "./GeneratedOutlines";
import ContentAnalysis from "../utils/ContentAnalysis";

const { useEffect } = wp.element;

const GenieSidebar = GenieMapProps(({ setTemplates, sidebar, setSidebar, setInput, getInputs }) => {
    let storage = window.getGenie.blogWizardData;
    delete storage?.post_id;

    useEffect(() => {
        const list = Object.values(window.getGenie.config.templateList || {});
        /**
         * add an id to make unique item in card component
         * template slug is not required
         * skipped for now this mechanism
         */
        /** const list = rawList.map(({templateSlug, ...rest}) => ({ ...rest, id: templateSlug })) */

        setTemplates({
            list
        })
    }, [])

    useEffect(() => {
        let value = getInputs['seoEnabled'];

        if (value) {
            if (getInputs['searchVolume'] &&
                sidebar.component !== 'TemplateListScreen' &&
                sidebar.component !== 'StatisticsScreen') {
                setSidebar({
                    analyzeKeyword: {
                        open: true
                    }
                })
            }
        }
        else {
            setSidebar({
                analyzeKeyword: {
                    open: false,
                    loading: false
                }
            })
        }

    }, [getInputs['searchVolume'], getInputs['seoEnabled'], sidebar.component])

    useEffect(() => {
        let currentPost = wp.data?.select('core/editor')?.getCurrentPost();
        if (currentPost?.content) {
            setSidebar({
                currentPostContent: currentPost.content || ''
            })
        }

        if (!storage || !Object.values(storage).some(Boolean)) {
            return;
        }


        setSidebar({
            component: 'TitleScreen',
            currentTemplate: 'blogWizard',
        })


        for (const [key, value] of Object.entries(storage)) {

            if (!value) {
                continue;
            }

            if (key === 'keywordData') {
                if (value && Object.values(value).length > 0) {
                    for (const [childKey, childValue] of Object.entries(value)) {
                        setInput(childKey, childValue)
                    }
                }

            }
            else if (key === 'serpData') {
                if (value && Object.values(value).length > 0) {
                    for (const [childKey, childValue] of Object.entries(value)) {
                        if (childKey === 'statisticsData') {
                            setSidebar({
                                statisticsData: childValue
                            })
                        }
                        else {
                            setInput(childKey, childValue)
                        }
                    }
                }
            }
            else {
                setInput(key, value)
            }

        };

    }, [])

    useEffect(() => {

        const statisticsData = sidebar.statisticsData,
            blog = sidebar.currentPostContent;

        const analyzedContent = new ContentAnalysis(statisticsData, blog);
        setSidebar({
            analyzedContent
        });

    }, [sidebar.statisticsData, sidebar.currentPostContent])

    let SidebarContent = GenieHelpers.components[sidebar.component] || (() => '');

    return (
        <>
            <DrawerWrapper>{(width) => (
                    <div className="getgenie-sidebar-content">
                        <Col className="extended-panel">
                            <AnalyzeKeywordScreen visible={sidebar.open && sidebar.analyzeKeyword.open} width={width} />

                            <GeneratedOutlines visible={sidebar.open && sidebar.generatedOutlines.open} width={width} />
                        </Col>
                        <Col className="wizard-screen">
                            <SidebarContent />
                        </Col>
                    </div>
            )}</DrawerWrapper>
        </>
    )
}, ['setTemplates', 'sidebar', 'setSidebar', 'setInput', 'getInputs']);

export default GenieSidebar;