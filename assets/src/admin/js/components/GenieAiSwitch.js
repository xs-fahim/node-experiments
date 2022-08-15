import { Col, Row, Switch } from "antd";
import { GenieMapProps } from "../map-props";
const { useEffect } = wp.element;


const GenieAiSwitch = GenieMapProps(({ getInputs, setInput, defaultChecked = false, className = '', name = '', label = '', ...props }) => {


    const handleChange = (value) => {
        setInput(name, value);
    }

    let updatedValue = getInputs[name] || defaultChecked;

    useEffect(() => { setInput(name, updatedValue) }, []);


    return (
        <Row justify="space-between" className={`getgenie-switch ${className}`}>
            <Col span={12} className="label">{label}</Col>
            <Col span={8} className="switch">
                <Switch name={name} checked={updatedValue} {...props} onChange={handleChange} />
            </Col>
        </Row>
    )
}, ['setInput', 'getInputs']);

export default GenieAiSwitch