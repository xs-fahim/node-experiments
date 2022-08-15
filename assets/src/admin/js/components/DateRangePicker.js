import { Form } from 'antd';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const { useEffect, useState } = wp.element
import { GenieMapProps } from '../map-props';

const { RangePicker } = DatePicker;
const DateRangePicker = GenieMapProps(({ setInput, getInputs, label = '', name = '', required = false }) => {

  const [error, setError] = useState(false)
  let updatedValue = getInputs[name] || [];

  const handleChange = (date, dateString) => {
    setInput(name, dateString);

    if (!dateString.length) {
      setError(true);
    } else {
      setError(false);
    }
  }

  useEffect(() => {
    setInput(name, updatedValue);
  }, []);

  return <>
    <div className="getgenie-daterange">
      <Form.Item label={label.length > 0 && "RangePicker"}>
        <RangePicker value={updatedValue ? updatedValue.map(singleDate => singleDate && moment(singleDate)) : ''}  name={name} className={name} onChange={handleChange} />
      </Form.Item>
    </div>
  </>;
}, ['setInput', 'getInputs']);

export { DateRangePicker }
