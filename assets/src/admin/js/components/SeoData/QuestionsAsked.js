import { Checkbox, Typography, } from 'antd';
import { GenieMapProps } from '../../map-props';

const QuestionsAsked = GenieMapProps(({ loading, setInput, getInputs, sidebar }) => {
    const questionsAsked = getInputs['questionsAsked'];
    const selectedOutlines = getInputs['selectedOutlines'] || [];

    /** update selected outlines on select any content */
    const onChange = (e, text) => {
        if (sidebar.component !== 'OutlineScreen') {
            return
        }
        let items = [...selectedOutlines];
        if (items.indexOf(text) != -1) {
            items.splice(items.indexOf(text), 1)
        } else {
            items.push(text)
        }
        setInput('selectedOutlines', items);
    }
   
    return (
        loading ?
            <h5 className='getgenie-loading-state'>{loading}</h5>
            :
            <div className="getgenie-questions-tab">
                <div className={`getgenie-checkbox ${sidebar.component === 'OutlineScreen' ? '' : 'disable'}`}>
                    {questionsAsked &&
                        questionsAsked.length === 0 ?
                        <Typography.Title level={5} className="getgenie-not-found-title">
                            No questions are found.
                        </Typography.Title>
                        :
                        questionsAsked.map(item => <>
                            <div className={`getgenie-checkbox-container${selectedOutlines.indexOf(item.title) != -1 ? ' active' : ''}`}>
                                <Checkbox checked={selectedOutlines.indexOf(item.title) > -1} onChange={e => onChange(e, item.title)}>
                                    <h4 className='question-title'>{item?.title}</h4>
                                </Checkbox>
                                <a className='question-source' target="_blank" href={item?.url}>{item?.url}</a>
                            </div>
                        </>)
                    }
                </div>
            </div>
    )
}, ['setInput', 'getInputs', 'sidebar']);

export { QuestionsAsked }