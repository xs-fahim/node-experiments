
import Alert from 'antd/lib/alert';
import Form from 'antd/lib/form';
import Tooltip from 'antd/lib/tooltip';
import { GenieRequestApi } from "../../../api-request";
import { GenieSelect } from '../../Select'
import GenieButton from '../../Button'
import GenieCard from '../../Card'
import { GenieMapProps } from "../../../map-props";
import GenieSlider from '../../Slider';
import GenieNumberInput from '../../NumberInput'
import { DrawerHeader } from '../../DrawerHeader';
import { DrawerFooter } from '../../DrawerFooter';
import { GenieAiInfoTooltip } from '../../GenieAiInfoTooltip';
import { SkeletonSingle } from '../../Skeletons/SkeletonSingle';
import processResponse from '../../../utils/processResponse';
import { ContentFeedback } from '../../ContentFeedback';
import { GenieHelpers } from '../../../utils/helpers';
import GenieTextarea from '../../Textarea';
import { createHistoryUrl } from '../../../api-request/endpoints';
const { useState, useEffect } = wp.element;

/** wp plugin page, not post editor */
const isAdminPage = !!document.querySelector('.getgenie-admin-page');
/** default context field for templates */
const defaultField = [{
    "name": "templateContext",
    "label": "Context",
    "type": "textarea",
    "placeholder": "Enter your text here",
    "required": true
}]
const WriteTemplatesScreen = GenieMapProps(({ setSidebar, templates, sidebar, getInputs, setInput }) => {
    let list = getInputs['generatedTemplateContents'] || []
    list = [...(new Set(list))];
    const [templateList, setTemplateList] = useState([]);
    const [showTooltip, setShowTooltip] = useState('');
    const [visibleAlert, setVisibleAlert] = useState(false)
    const [inputFields, setInputFields] = useState(defaultField)
    const [writeLoading, setWriteLoading] = useState(false);

    useEffect(() => {
        /** creating an array of templates for showing them in select field */
        let data = templates.list.map(item => (
            {
                value: item.templateSlug,
                label: item.title,
                inputFields: item?.inputFields || [] /** check later */
            }
        ))
        setTemplateList(data)
        setSidebar({
            analyzeKeyword: {
                open: false
            },
            generatedOutlines: {
                ...sidebar.generatedOutlines,
                open: false
            }
        });

    }, []);

    useEffect(() => {

        if (!sidebar.open) {
            return
        }

        /** set multi input fields array */
        let fields = templates.list.find(item => item.templateSlug === sidebar.currentTemplate)?.inputFields;
        if (!fields || fields.length === 0) {
            fields = defaultField
        }

        const inputName = fields[0]?.name;

        setInputFields(fields)

        /** check if current page is from dashboard */
        if (!wp.data?.select("core/editor")?.getSelectedBlock()) {
            return
        }


        /** 
         * @todo recheck if the includes is necessary. update it later 
         */
        if (["paragraph-rewriter", "sentence-rewriter"].includes(sidebar.currentTemplate)) {
            setInput(inputName, getInputs['templateContext'])
        }


        /** select the current wp post block */
        let selectedBlock = wp.data.select("core/editor").getSelectedBlock();
        let content = selectedBlock?.attributes?.content || '';

        if (sidebar.currentTemplate === "next-paragraph") {
            content = content.replace(/<br\s*[\/]?>/g, "")
            if (content.length > 1000) {
                content = content.substring(0, 1000)
            }
            setInput(inputName, content);
        }
        else if (sidebar.currentTemplate === "next-sentence") {
            /**
             * @todo recheck this mechanism and minimize later
             */
            let selection = document.getSelection(),
                currentParagraph = selection.focusNode.data || '';

            let currentSentence = currentParagraph.substring(0, selection.focusOffset);

            currentSentence = currentSentence.substring(0, currentSentence.lastIndexOf('.'))

            currentSentence = currentSentence.substring(currentSentence.lastIndexOf('.') + 1)

            if (currentSentence.length === '') {
                currentSentence = currentParagraph.substring(0, currentSentence.indexOf('.'))
            }
            if (currentSentence.length === '') {
                currentSentence = currentParagraph.substring(0, selection.focusOffset)
            }
            setInput(inputName, currentSentence);
        }

    }, [sidebar.currentTemplate, sidebar.open])


    const handleWrite = (values) => {
        const input = {}

        for (const item of inputFields) {
            input[item.name] = getInputs[item.name] || ''
        }

        let data = {
            input,
            templateSlug: sidebar.currentTemplate,
            creativity: getInputs['templateCreativityLevel'],
            resultCount: getInputs['templateResultLimit']
        }

        /** remove default properties and use form values only */
        delete data.templateCreativityLevel;
        delete data.templateResultLimit;

        setWriteLoading(true);
        GenieRequestApi.writeTemplates((res) => {
            setWriteLoading(false);

            processResponse(res, () => {

                let result = res.data.map((item) => {
                    /** adding extra attributes for feedback feature */
                    return { title: item, like: false, dislike: false }
                });
                setInput('generatedTemplateContents', result);
                setVisibleAlert(true);

                setTimeout(() => setVisibleAlert(false), 4000)

                /** for temporary purpose, later update the mechanism */
                let historyData = data;
                delete historyData?.resultCount;
                historyData.output = res.data;
                historyData.templateType = 'writer-default';
                fetch(createHistoryUrl, {
                    method: 'POST',
                    body: JSON.stringify(historyData),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'X-WP-Nonce': window.getGenie.config?.restNonce || ''
                    },
                });
                
            })
        }, data);
    }

    useEffect(() => {

        /** show/hide tooltip based on sidebar appearance */
        if (sidebar.open) {
            document.querySelectorAll('.ant-tooltip').forEach(item => item.style.visibility = 'hidden')
        }
        else {
            document.querySelectorAll('.ant-tooltip').forEach(item => item.style.visibility = 'visible')
        }

    }, [sidebar.open])


    const handleActiveList = (e, value) => {

        let copyAbleText = value.title.replace(/<br\/>/g, "")

        /** copy the clicked item text to clipboard */
        GenieHelpers.copyToClipboard(copyAbleText)
            .then(() => {
                setShowTooltip(value.title);

                setTimeout(() => {
                    setShowTooltip(null)
                }, 2000);
            })
            .catch(() => console.log('error'));

    }
    /**
    * @function updateCurrentBlock
    * @param {number} clientId current wp post cliend id
    * @param {string} oldContent previous post content of current post
    * @param {string} newContent new content generated by template
    */
    const updateCurrentBlock = (clientId, oldContent, newContent) => {
        let content = oldContent + newContent;
        wp.data.dispatch('core/editor').updateBlock(clientId, {
            attributes: {
                content
            }
        });
        setSidebar({
            open: false
        });
    }

    const insertContent = (e, value) => {
        e.stopPropagation();
        /** selecting current post block */
        let selectedBlock = wp.data.select("core/editor").getSelectedBlock();
        let clientId = selectedBlock?.clientId;
        let content = selectedBlock?.attributes?.content;
        let allBlocks = wp.data.select("core/editor").getBlocks();
        /** get the appropriate position where new content will be inserted */
        let index = allBlocks.findIndex(item => item.clientId === clientId)

        /** replace all br tag with new line to work properly as string */
        let text = value.replace(/<br\s*[\/]?>/g, "\n");

        if (sidebar.toolbarWriting &&
            ["sentence-rewriter", "paragraph-rewriter", "paragraph-answer"].includes(sidebar.currentTemplate)) {
            /** if toolbar writing is on then get replacable function from redux store */
            let replace = getInputs['updateContent'];
            replace(text);
        }
        else if (sidebar.currentTemplate === 'next-paragraph') {
            /** insert content with desired index value */
            wp.data.dispatch("core/editor").insertBlocks(
                wp.blocks.createBlock("core/paragraph", {
                    content: text
                }), index + 1
            );
        }
        else {
            if (!clientId) { return; }

            text = value;
            if (content) {
                text = ' ' + text;
            }
            updateCurrentBlock(clientId, content, text)
        }
    }

    /** update current template value in redux store */
    const handleTemplateChange = (value) => {
        setSidebar({
            currentTemplate: value
        });
    }
    return (
        <>
            <DrawerHeader />
            <Form layout="vertical" className="getgenie-sidebar-writing-form" onFinish={handleWrite}>
                <div className="getgenie-sidebar-writing">
                    <GenieSelect handleOnChange={handleTemplateChange} className="getgenie-select" defaultValue={sidebar.currentTemplate}
                        label="Select Templates" options={templateList} />
                    {
                        inputFields.map(item => (
                            <GenieTextarea label={`${item?.label || ''} ${item?.required ? '' : '(Optional)'}`} name={item?.name} rows={4}
                                placeholder={item?.placeholder}
                                required={item?.required} />
                        )
                        )
                    }

                    <GenieSlider name="templateCreativityLevel" label={<>Creativity Level <GenieAiInfoTooltip title={"How much creative you want genie to be"} placement={"top"}>i</GenieAiInfoTooltip></>} message={false} defaultValue={4} />

                    <GenieNumberInput name="templateResultLimit" max={10} type="text" defaultValue={2} label={<>Set Result Limit <GenieAiInfoTooltip title="Maximum content you want to generate" placement="top">i</GenieAiInfoTooltip></>} required={true} errorMessage="Please choose valid limit" />

                    <GenieButton htmlType="submit" type="primary" loading={writeLoading}>Write</GenieButton>
                </div>

                <div className="getgenie-card-container editor" style={{ backgroundColor: list.length === 0 && "transparent" }} >
                    <GenieCard list={list} handleClick={handleActiveList} column={1} skeleton={writeLoading ? () => <SkeletonSingle count={5} /> : ''}>{
                        (item) => (
                            <>
                                <Tooltip placement="right" title={(showTooltip === item.title) && "Copied"} visible={(showTooltip === item.title) && sidebar.open} zIndex={999999}>
                                    <h5 className='generated-content'>
                                        <div dangerouslySetInnerHTML={{ __html: item.title }} />
                                    </h5>
                                </Tooltip>
                                <ContentFeedback content={item}
                                    input={getInputs[inputFields[0]?.name] || ''}
                                    creativityLevel={getInputs['templateCreativityLevel']} listName='generatedTemplateContents' />

                                <Tooltip title="Insert this content" placement='topLeft'>
                                    <span className='getgenie-insert-content' onClick={(e) => insertContent(e, item.title)}>
                                        <img src={sidebar.imageUrl + '/plus.png'} />
                                    </span>
                                </Tooltip>
                            </>
                        )
                    }</GenieCard>

                    {visibleAlert && <Alert
                        className="template-screen-alert"
                        message="Click on the text to copy"
                        closeText="Okay"
                        closable
                    />}
                </div>


            </Form>

            {sidebar.toolbarWriting ? '' : <DrawerFooter prevScreen='TemplateListScreen' />}

        </>
    )
}, ['setSidebar', 'templates', 'sidebar', 'templates', 'setTemplates', 'getInputs', 'setInput']);

export { WriteTemplatesScreen }
