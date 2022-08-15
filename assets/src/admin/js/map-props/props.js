const { withSelect, withDispatch } = wp.data,
    namespace = 'genie';

const GenieProps = {
    sidebar: withSelect((select) => {
        return {
            sidebar: select(namespace).sidebar(),
        };
    }),
    templates: withSelect((select) => {
        return {
            templates: select(namespace).templates(),
        };
    }),

    setTemplates: withDispatch((dispatch) => {
        return {
            setTemplates(value) {
                dispatch(namespace).setTemplates(value);
            }
        };
    }),
    limitUsage: withSelect((select) => {
        return {
            limitUsage: select(namespace).limitUsage(),
        };
    }),

    setLimitUsage: withDispatch((dispatch) => {
        return {
            setLimitUsage(value) {
                dispatch(namespace).setLimitUsage(value);
            }
        };
    }),
    setSidebar: withDispatch((dispatch) => {
        return {
            setSidebar(value) {
                dispatch(namespace).setSidebar(value);
            }
        };
    }),

    setCurrentTemplate: withDispatch((dispatch) => {
        return {
            setCurrentTemplate(value) {
                dispatch(namespace).setCurrentTemplate(value);
            }
        };
    }),

    currentTemplate: withSelect((select) => {
        return {
            currentTemplate: select(namespace).getCurrentTemplate(),
        };
    }),

    getTemplateInputs: withSelect((select) => {
        return {
            getTemplateInputs: select(namespace).getTemplateInputs(),
        };
    }),

    getInputs: withSelect((select) => {
        return {
            getInputs: select(namespace).getInputs(),
        };
    }),

    setInput: withDispatch((dispatch) => {
        return {
            setInput(name, value) {
                dispatch(namespace).setInput(name, value);
            }
        };
    }),

    resetSidebar: withDispatch((dispatch) => {
        return {
            resetSidebar(name, value) {
                dispatch(namespace).resetSidebar();
            }
        };
    }),

    resetTemplateInputs: withDispatch((dispatch) => {
        return {
            resetTemplateInputs(value) {
                dispatch(namespace).resetTemplateInputs(value);
            }
        };
    }),
}

export { GenieProps };