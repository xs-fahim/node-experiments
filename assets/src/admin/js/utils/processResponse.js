import { Modal } from "antd";
import showNotification from "./showNotification";

const processResponse = (res, callback) => {
    const message = res?.message || [];
    if (res?.networkErr) {
        showNotification('error', 'Something went wrong!', message.join(' '), 'topRight')
    }
    else {
        if (res?.status === 'success') {
            callback()
        }
        else {
            if (!window.getGenie.config?.siteToken || message.join('').toLowerCase().includes('access denied')) {
                wp.data.dispatch('genie').setSidebar({open: false});
                Modal.error({
                    title: 'Failed!',
                    content: message.join(' '),
                    className: 'getgenie-confirm-modal',
                    getContainer: () => document.querySelector('.getgenie-main-container'),
                });
            }
            else {
                showNotification('error', 'Failed!', message.join(' '), 'topRight')
            }
        }
    }
}

export default processResponse; 