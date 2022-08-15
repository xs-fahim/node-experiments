const { addAction } = wp.hooks;

require('./scripts')
import './stores/genie';
import Template from './template';


/** define hooks those are called in scripts/index.js */
addAction('getgenie_adminbar_menu', 'xs', () => {
    let adminbar = document.getElementById('wp-admin-bar-getgenie-template-list');

    adminbar.addEventListener('click', e => {
        wp.data.dispatch('genie').setSidebar({
            open: true,
            component: "TemplateListScreen",
            toolbarWriting: true,
            globalTemplateMode: true
        });
    })
});

/** define hooks those are called in scripts/index.js */
addAction('getgenie_adminbar_menu', 'xs', () => {
    let adminbar = document.getElementById('wp-admin-bar-getgenie-template-list');

    adminbar.addEventListener('click', e => {
        wp.data.dispatch('genie').setSidebar({
            open: true,
            component: "TemplateListScreen",
            toolbarWriting: true,
            globalTemplateMode: true
        });
    })
});

addAction('genieai_after_render_app_template', 'xs', () => {
    let appRoot = document.getElementById('getgenie-template-container');

    if (appRoot) {
        ReactDOM.render(<Template />, appRoot);
    } else {
        console.warn("There is no toolbar.");
    }
});