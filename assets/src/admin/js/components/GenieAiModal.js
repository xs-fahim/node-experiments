
import { Modal } from 'antd';
import { CloseCircleFilled } from "@ant-design/icons";
export const GenieAiModal = ({ children, className, centered, closeIcon, footer, isModalVisible, setIsModalVisible, title = '', closable = true, onClose = (close) => '' }) => {
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    onClose();
  };
  return <>
    <Modal className={className} title={title} visible={isModalVisible} closeIcon={closeIcon ? closeIcon : CloseCircleFilled} closable={closable} onOk={handleOk} onCancel={handleCancel} centered={centered} footer={footer} >
      {children}
    </Modal>
  </>;
};