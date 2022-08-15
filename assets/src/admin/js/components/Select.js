import { GenieMapProps } from "../map-props";
import { Select, Form, Spin } from 'antd';
const { Option } = Select;
const { useEffect } = wp.element;
import Loading from "./Loading";

const GenieSelect = GenieMapProps(({ options, setInput, getInputs, name = '', defaultValue = '', placeholder = "", className = '', handleOnChange = () => '', onSearch = () => { }, ...props }) => {
    const handleChange = (value) => {

        handleOnChange(value);
        setInput(name, value);
    }

    let updatedValue = getInputs[name] || defaultValue;
    useEffect(() => {
        setInput(name, updatedValue);
    }, []);

    return (
        <Form.Item>
            <Select showSearch value={updatedValue || null}
                placeholder={placeholder}
                {...props}
                name={name}
                notFoundContent={props?.loading ? <Loading fontSize={25} /> : null}
                suffixIcon={<span className="getgenie-icon-chevron_down"></span>}
                className={className}
                onChange={handleChange} onSearch={onSearch}
                filterOption={(input, option) => {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
                filterSort={(optionA, optionB) => {
                    return optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }}
            >
                {options.map(option => <Option value={option.value}>{option.label}</Option>)}
            </Select>
        </Form.Item>
    )
}, ['setInput', 'getInputs', 'setSidebar']);

export { GenieSelect } 