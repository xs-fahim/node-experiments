
import { Popover } from 'antd';
const { useState } = wp.element
const GenieAiPopover = ({ children, placement = 'top', title = '', content = '', isVisible = false, overlayStyle = {} }) => {
    const [visible, setVisible] = useState(isVisible)

    const handleVisibleChange = visible => {
        setVisible(visible)
    };

    return <Popover
        content={content}
        overlayStyle={overlayStyle}
        title={title}
        trigger="click"
        placement={placement}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        zIndex={9999}
    >
        {children}
    </Popover>
}

export { GenieAiPopover }