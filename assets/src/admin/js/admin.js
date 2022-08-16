const { addAction } = wp.hooks;
import './Components'
const { HeaderToolbar } = window.getGenie.component;
import App from './App';

import './scripts/scoreUpdater.js';
import './scripts/sentenceRewrite.js'
import './scripts/index.js'

import './stores/genie';

/** define hooks those are called in scripts/index.js */
addAction('genieai_after_render_toolbar', 'xs', () => {
    let toolbar = document.getElementById('xs-custom-toolbar');

    if (toolbar) {
        ReactDOM.render(<HeaderToolbar />, toolbar);
    } else {
        console.warn("No toolbar is found.")
    }
});



addAction('genieai_after_render_app', 'xs', () => {
    let appRoot = document.getElementById('getgenie-container');

    if (appRoot) {
        ReactDOM.render(<App />, appRoot);
    } else {
        console.warn("There is no toolbar.");
    }
});