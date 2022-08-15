import { GenieRequestApi } from "../api-request";
import processResponse from "../utils/processResponse";

const { Toolbar, DropdownMenu } = wp.components
const { BlockControls } = wp.blockEditor;
const { registerFormatType, insert, getTextContent, slice } = wp.richText;
const imageUrl = `${window.getGenie.config.assetsUrl}/dist/admin/images/genie-head.svg`;

registerFormatType(
    'genie/sentence-rewrite',
    {
        title: 'Sentence Rewrite',
        tagName: 'a',
        className: 'getgenie-sentence-rewrite',
        edit: ({ isActive, value, onChange }) => {

            const selectedText = getTextContent(slice(value));

            const writeContent = (content, type, callback) => {
                let data = {
                    title: wp.data.select('genie').getTemplateInputs()?.blogWizard?.selectedTitle || '',
                    keyword: wp.data.select('genie').getTemplateInputs()?.blogWizard?.keyword || '',
                    context: wp.data.select('genie').getTemplateInputs()?.blogWizard?.inputContext || '',
                    textContent: content.replace(/<br\s*[\/]?>/g, ""),
                }

                document.body.classList.add('make-cursor-wait');

                if (type === 'continue-writing') {
                    GenieRequestApi.continueWriting((res) => {
                        document.body.classList.remove('make-cursor-wait');
                        window.getGenie.config.usingShortcut = false;
                        processResponse(res, () => {
                            let result = res.data[0] || '';
                            callback(result);
                        })

                    }, data);
                }
                else {
                    GenieRequestApi.expandOutline((res) => {
                        document.body.classList.remove('make-cursor-wait');
                        window.getGenie.config.usingShortcut = false;
                        processResponse(res, () => {
                            let result = res.data[0] || '';
                            callback(result);
                        })

                    }, data);
                }
            }

            const onClick = (template) => {

                let context = '';

                let editor = wp.data.select('core/editor'),
                    blocks = editor.getBlocks(),
                    clientId = editor.getSelectedBlockClientId();

                let index = blocks.findIndex(item => item.clientId === clientId);

                if (template === 'continue-writing') { //continue writing

                    let str = '', contentEndPos, lastPos, prevContent;

                    for (const curr of blocks) {

                        str += curr.attributes.content;

                        if (curr.clientId === clientId) {

                            contentEndPos = value.formats.length - value.end;
                            lastPos = str.length - contentEndPos;
                            prevContent = str.substring(0, lastPos);
                            context = prevContent.slice(-1000);

                            writeContent(context, template, (data) => {
                                let updatedData = data.replace(/(\<br[\s]*\/?\>[\s]*)+/g, "\n");
                                if (value.text[value.end - 1] !== ' ') {
                                    updatedData = ' ' + updatedData;
                                }
                                onChange(insert(value, updatedData))
                            })

                            break
                        }
                    }
                }
                else if (template === 'outline-expand') {

                    if (!selectedText) { return }

                    writeContent(selectedText, template, (data) => {
                        let updatedData = data.replace(/(\<br[\s]*\/?\>[\s]*)+/g, "<br>");
                        let paragraphs = updatedData.split('<br>');
                        
                        for (const textItem of paragraphs) {
                            wp.data.dispatch("core/editor").insertBlocks(
                                wp.blocks.createBlock("core/paragraph", {
                                    content: textItem
                                }), index + 1
                            );
                            index++;
                        }

                    })
                }
                else {
                    let sentences = selectedText.split(/[.!?]+\s/).filter(Boolean).length;
                    let relatedTemplate = sentences > 1 ? 'paragraph-rewriter' : 'sentence-rewriter';
                    wp.data.dispatch('genie').setSidebar({
                        open: true,
                        component: "WriteTemplatesScreen",
                        currentTemplate: relatedTemplate,
                        toolbarWriting: true
                    });

                    context = selectedText
                    context = context.replace(/<br\s*[\/]?>/g, "");
                    wp.data.dispatch('genie').setInput('templateContext', context)
                    wp.data.dispatch('genie').setInput('updateContent', (text) => onChange(insert(value, text)))
                }

            }

            // document.addEventListener('keydown', (e) => {
            //     if (window.getGenie.config.usingShortcut) { return }

            //     if (e.key.toLowerCase() === 'c' && e.shiftKey && e.ctrlKey) {
            //         e.preventDefault();

            //         console.log('data', e, value);

            //         if (!window.getGenie.config.usingShortcut) {
            //             onClick('continue-writing')
            //             console.log("generating content")
            //         }
            //         window.getGenie.config.usingShortcut = true;
            //         e.stopPropagation()
            //     }
            // });

            return (
                <BlockControls>
                    <Toolbar className="getgenie">
                        <DropdownMenu
                            icon={<img src={imageUrl} />}
                            label="Write Content"
                            controls={[
                                {
                                    title: 'Expand Outline',
                                    onClick: () => onClick('outline-expand'),
                                    isDisabled: !selectedText
                                },
                                {
                                    // title: <span>Continue Writing
                                    //     <span className="getgenie-toolbar-shortcut">
                                    //         Shift+Alt+C
                                    //     </span>
                                    // </span>,
                                    title: 'Continue Writing',
                                    onClick: () => onClick('continue-writing'),
                                    isDisabled: selectedText
                                },
                                {
                                    title: 'Content Re-write',
                                    onClick: () => onClick('sentence-rewriter'),
                                    isDisabled: !selectedText
                                }
                            ]}
                        />
                    </Toolbar>
                </BlockControls>

            )
        },
    }
)