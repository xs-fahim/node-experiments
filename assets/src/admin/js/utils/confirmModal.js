import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const confirmModal = (title = '', content = '', onYes = () => '', onCancel = () => '') => {
    Modal.confirm({
        title: title,
        icon: <ExclamationCircleOutlined />,
        content: content,
        okText: 'Yes',
        cancelText: 'No',
        className: 'getgenie-confirm-modal',
        getContainer: () => document.querySelector('.getgenie-main-container'),
        onOk() {
            onYes();
        },
        onCancel() {
            onCancel();
        },
    });
}

export { confirmModal }