import { Alert } from 'antd';
import { GenieMapProps } from '../../map-props';


const Feedback = GenieMapProps(({sidebar}) => {
    const { feedbacks } = sidebar.analyzedContent;
    const alertType = key => {
        return key === 'problems' ? 'error' : key === 'results' ? 'success' : 'warning'
    }

    return (
        <div className="getgenie-statistics-score-analysis">
            <div className="getgenie-statistics-score-analysis-heading">
                <h5 className="title">Analysis</h5>
            </div>
            {
                Object.keys(feedbacks).map(key => (

                    feedbacks[key].length !== 0 ? <div className={`getgenie-statistics-score-analysis-info ${key}`}>
                        <h5 className="title">{key}</h5>
                        <div className="analyzed-list">
                            {
                                feedbacks[key].map(item => <Alert description={item} type={alertType(key)} showIcon />)
                            }
                        </div>
                    </div>
                        :
                        ''
                )
                )
            }
        </div>
    )
}, ['sidebar'])

export default Feedback;