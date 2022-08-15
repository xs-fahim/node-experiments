import { GenieMapProps } from "../map-props";
import { Input, Form } from 'antd';
const { useEffect } = wp.element;

const GenieTextarea = GenieMapProps(({ name, setInput, getInputs, label = "", defaultValue = '', ...props }) => {

    const handleChange = (value) => {
        setInput(name, value);
    }

    useEffect(() => {
        setInput(name, getInputs[name] || defaultValue);
    }, []);

    let updatedValue = getInputs[name] || defaultValue;

    return (
        <Form.Item
            label={label}
            key={name}
            className="genie-input"
        >
            <Input.TextArea {...props} value={updatedValue} onChange={(e) => handleChange(e.target.value)} />
        </Form.Item>
    )
}, ['setInput', 'getInputs', 'sidebar']);

export default GenieTextarea