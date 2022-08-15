const { createReduxStore, register } = wp.data;

const DEFAULT_STATE = {
    inputs: {},
    sidebar: {
        currentPostContent: '',
        statisticsScreen:{
            triggered: false,
            loading: false
        },
        statisticsData: '',
        currentTemplate: '',
        analyzedContent: {},
        toolbarWriting: false, /** to identify whether toolbar writing mode is on or off */
        globalTemplateMode: false,
        component: '',
        open: false, /** toggle sidebar */
        analyzeKeyword: {
            open: false,
        },
        analyzingSearchVolume: false, /** loading variable for search volume */
        analyzingRelatedKeyword: false, /** loading variable for related keyword */
        generatedOutlines: {
            open: false,
            loading: false
        },
        imageUrl: `${window.getGenie.config.assetsUrl}/dist/admin/images`
    },
    templates: {
        list: []
    },
    limitUsage: {
        sites: [],
        subscriptions: []
    }
};

const actions = {
    setSidebar(value) {
        return {
            type: 'SET_SIDEBAR',
            value
        };
    },
    setCurrentTemplate(value) {
        return {
            type: 'SET_CURRENT_TEMPLATE',
            value
        };
    },
    setInput(name, value) {
        return {
            type: 'SET_INPUT',
            name,
            value
        };
    },
    setTemplates(value) {
        return {
            type: 'SET_TEMPLATES',
            value
        };
    },
    setLimitUsage(value) {
        return {
            type: 'SET_LIMIT_USAGE',
            value
        };
    },
    resetSidebar(value) {
        return {
            type: 'RESET_SIDEBAR',
            value
        };
    },
    resetTemplateInputs(value) {
        return {
            type: 'RESET_TEMPLATE_INPUTS',
            value
        };
    }
};

const store = createReduxStore('genie', {
    reducer(state = DEFAULT_STATE, action) {
        switch (action.type) {
            case 'SET_SIDEBAR':
                return {
                    ...state,
                    sidebar: {
                        ...state.sidebar,
                        ...action.value
                    }
                };
            case 'SET_CURRENT_TEMPLATE':
                return {
                    ...state,
                    currentTemplate: action.value
                };
            case 'SET_INPUT':
                return {
                    ...state,
                    inputs: {
                        ...state.inputs,
                        [state.sidebar.currentTemplate]: {
                            ...(state.inputs[state.sidebar.currentTemplate]) || {},
                            [action.name]: action.value
                        }
                    }
                };
            case 'SET_TEMPLATES':
                return {
                    ...state,
                    templates: {
                        ...state.templates,
                        ...action.value
                    }
                };
            case 'SET_LIMIT_USAGE':
                return {
                    ...state,
                    limitUsage: {
                        ...state.limitUsage,
                        ...action.value
                    }
                };
            case 'RESET_SIDEBAR':
                return {
                    ...state,
                    sidebar: DEFAULT_STATE.sidebar
                };
            case 'RESET_TEMPLATE_INPUTS':
                let inputs = { ...state.inputs };
                delete inputs[action.value];
                return {
                    ...state,
                    inputs
                };
        }

        return state;
    },

    actions,

    selectors: {
        sidebar(state) {
            return state.sidebar;
        },
        getCurrentTemplate(state) {
            return state.currentTemplate;
        },
        getInputs(state) {
            return state.inputs[state.sidebar.currentTemplate] || {};
        },
        getTemplateInputs(state) {
            return state.inputs;
        },
        templates(state) {
            return state.templates;
        },
        limitUsage(state) {
            return state.limitUsage;
        },
    }
});

register(store);