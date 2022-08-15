import { GenieMapProps } from "../map-props";
import { Input, Form } from 'antd';
const { useEffect } = wp.element;


const GenieNumberInput = GenieMapProps(({ name, setInput, getInputs, sidebar, defaultValue = 1, max = null, label = "", placeholder = "", type = "text", required = false, errorMessage = '', ...props }) => {

    let updatedValue = getInputs[name] || defaultValue;

    const handleChange = (value) => {
        if (isNaN(value)) {
            return
        }
        if (max && value > max) {
            return
        }
        setInput(name, value);
    }
    /** optimize this mechanism later */
    useEffect(() => handleChange(getInputs[name] || updatedValue), [sidebar.currentTemplate]);

    const updateValue = num => {

        if (props?.disabled) {
            return
        }
        if (updatedValue === 1 && num === -1) {
            return
        }

        let value = (parseInt(updatedValue) + parseInt(num));

        if (max && value > max) {
            return
        }
        setInput(name, value);
    }

    return (
        <Form.Item initialValue={updatedValue} className="NumberInput" label={label} name={name} rules={[{ required: required, message: errorMessage }]}>
            <span className="icon dashicons dashicons-minus" onClick={() => updateValue(-1)}></span>
            <Input {...props} type={type} placeholder={placeholder} value={updatedValue} defaultValue={updatedValue} onChange={(e) => handleChange(e.target.value)} />
            <span className="icon dashicons dashicons-plus" onClick={() => updateValue(1)}></span>
        </Form.Item>
    )
}, ['setInput', 'getInputs', 'sidebar']);

export default GenieNumberInput;