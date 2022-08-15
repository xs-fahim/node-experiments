import { Slider, Form } from "antd";
import Badge from 'antd/lib/badge';
import { GenieMapProps } from "../map-props";
const { useEffect } = wp.element;

const GenieSlider = GenieMapProps(({ label, name, setInput, getInputs, sidebar, defaultValue, message, className = '', ...props }) => {
    let max = props.max || 5,
        min = props.min || 1;

    const handleChange = (value) => {
        setInput(name, value);
    }

    useEffect(() => {
        setInput(name, getInputs[name] || defaultValue);
    }, [sidebar.currentTemplate]);

    let updatedValue = getInputs[name] || defaultValue;

    return (
        <Form.Item label={label} className={"getgenie-slider" + " " + className} name={name}>
            <Badge count={`${updatedValue || min}/${max}`} />
            <Slider min={min} max={max} {...props} value={updatedValue} onChange={handleChange} />
        </Form.Item>
    )
}, ['getInputs', 'setInput', 'sidebar']);

export default GenieSlider