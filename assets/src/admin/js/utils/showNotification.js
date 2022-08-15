import { notification } from "antd";

const showNotification = (type, title, message = '', placement = 'top') => {
    notification[type]({
        message: title,
        description: message,
        placement,
        getContainer: () => document.querySelector('.getgenie-main-container'),
        duration: 5
    });

}

export default showNotification 