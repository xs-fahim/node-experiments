import { Divider, Typography } from 'antd';
import { GenieMapProps } from "../../../map-props";
import GenieCard from "../../Card";
import { DrawerHeader } from "../../DrawerHeader";
import { confirmModal } from "../../../utils/ConfirmModal";
import { GenieHelpers } from '../../../utils/helpers';
const { useEffect } = wp.element;

const TemplateListScreen = GenieMapProps(({ templates, setSidebar, sidebar, setInput, getTemplateInputs, resetTemplateInputs }) => {
    const { list } = templates; /** get the template list */
    /**
    * @var blogWizard
    * @type {object}
    * @description fixed wizard to be added in template list
    */
    const blogWizard = {
        title: "Blog Wizard",
        templateSlug: "blogWizard",
        description: "Get your blog article SERP-ready — from analyzing the keywords to generating content that ranks",
        categories: {
            general: {
                title: "General",
                slug: "general"
            }
        }
    };
    let updatedList = list;

    if(!sidebar.globalTemplateMode){
        updatedList = [blogWizard, ...list]
    }

    useEffect(() => {

        setSidebar({
            analyzeKeyword: {
                open: false
            },
            generatedOutlines: {
                ...sidebar.generatedOutlines,
                open: false
            }
        });

        /** turn off toolbar writing mode initially */

        setSidebar({
            toolbarWriting: false
        });
        setInput('updateContent', '')

    }, [])

    const handleActiveList = (e, item) => {

        /**
         * @description by default set the component as WriteTemplate
         * @description if template is blog wizard then open TitleScreen
         */
        let component = 'WriteTemplatesScreen'
        if (item.templateSlug == 'blogWizard') {
            component = 'TitleScreen'
        }

        const updateScreen = () => {
            setSidebar({
                component,
                currentTemplate: item.templateSlug
            });
        }

        /** check if current template has any generated data */
        if (getTemplateInputs[item.templateSlug]?.keyword) {

            confirmModal('This wizard has generated data',
                'Do you want to erase that data?',
                () => { resetTemplateInputs(item.templateSlug); updateScreen() },
                updateScreen)
        }
        else {
            updateScreen()
        }
    }
    return (
        <>
            <DrawerHeader />
            <div className="getgenie-sidebar-template">
                <Typography.Title level={3}>What are we writing ?</Typography.Title>
                <Divider />
                <div className="getgenie-template-list">
                    <GenieCard list={updatedList} handleClick={handleActiveList}>{
                        (item) => {
                            return <>
                                <div className="card-container">
                                    <div className="card-icon">
                                        <span className="dashicons dashicons-edit"></span>
                                    </div>

                                    <div className='card-heading'>
                                        <h5>{item?.title}</h5>
                                        <p>{item?.description}</p>
                                    </div>
                                </div>
                            </>
                        }
                    }</GenieCard>
                </div>
            </div>

        </>
    )
}, ['setSidebar', 'sidebar', 'templates', 'setInput', 'getInputs', 'resetTemplateInputs', 'getTemplateInputs']);

export { TemplateListScreen };