import { Button, Form } from "antd"

const GenieButton = ({ children, onClick, loading = false, ...props }) => {
    return (
        <Form.Item>
            <Button {...props} onClick={onClick} loading={loading} >{children}</Button>
        </Form.Item>
    )
}

export default GenieButton;