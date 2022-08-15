const { useEffect } = wp.element;
import { GenieMapProps } from "../map-props";

const AutocompleteTemplates = GenieMapProps(({ templates, setSidebar,sidebar, setInput }) => {
    useEffect(() => {
        setSidebar({
            toolbarWriting: false
        });
        setInput('updateContent','')
        
        if (templates.list.length) {
              wp.hooks.addFilter(
                'editor.BlockEdit',
                'getgenie/blockeditautocomplete',
                (wp.compose.createHigherOrderComponent((BlockEdit) => {

                    const completer = {
                        name: "Autocomplete",
                        /** The prefix that triggers this completer */
                        triggerPrefix: "\\", /** only Backslash */
                        /** The option data */
                        options: templates.list,
                        /** Returns a label for an option */
                        getOptionLabel: option => (
                            <span>
                                {option.title}
                            </span>
                        ),
                        /** Declares that options should be matched by their name or value */
                        getOptionKeywords: option => [option.templateSlug, option.title],
        
                        getOptionCompletion: option => {
                           
                            setSidebar({
                                open: true,
                                currentTemplate: option.templateSlug,
                                component: 'WriteTemplatesScreen',
                                analyzeKeyword: {
                                    open: false
                                },
                                generatedOutlines: {
                                    ...sidebar.generatedOutlines,
                                    open: false
                                }
                            });
                            setSidebar({
                                currentTemplate: option.templateSlug
                            })
                            return '';
                        },
                    };
                    const appendCompleter = (completers, blockName) => (blockName === 'core/paragraph' ? completers.concat(completer) : completers);
    
                    wp.hooks.addFilter(
                        'editor.Autocomplete.completers',
                        'genieai/autocompleteTemplates',
                        appendCompleter
                    );

                    return (props) =><BlockEdit  {...props} />
                  }, 'withClientIdClassName'))
              );
        }
    }, [templates])

    return '';
}, ['templates', 'setSidebar', 'sidebar', 'setInput']);

export default AutocompleteTemplates