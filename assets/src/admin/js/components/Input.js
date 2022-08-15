import { GenieMapProps } from "../map-props";
import { Input, Form } from 'antd';
const { useEffect, useState } = wp.element;


const GenieInput = GenieMapProps(({ name, setInput, getInputs, autoComplete ="off", className = '', defaultValue = '', label = "", required = false, errorMessage = '', ...props }) => {
    /** to display error message */
    const [error, setError] = useState(false)

    const handleChange = (value) => {
        setInput(name, value);

        if (!value.length) {
            setError(true);
        } else {
            setError(false);
        }
    }

    useEffect(() => {
        /** update property value in redux store with default value */
        setInput(name, getInputs[name] || defaultValue);
    }, []);

    let updatedValue = getInputs[name] || defaultValue;

    return (
        <Form.Item className={`genie-input ${className} ${(required && error && !updatedValue) && 'ant-form-item-has-error'}`} label={label} >
            <Input value={updatedValue} name={name} autoComplete={autoComplete} {...props} onChange={(e) => handleChange(e.target.value)} />

            {required && error && !updatedValue ? <p className="ant-form-item-explain-error">{errorMessage}</p> : ''}
        </Form.Item>
    )
}, ['setInput', 'getInputs', 'sidebar']);

export default GenieInput