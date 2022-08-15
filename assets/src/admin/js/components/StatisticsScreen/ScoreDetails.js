import { Row, Col, Progress } from 'antd';
import { GenieMapProps } from '../../map-props';
import { GenieHelpers } from '../../utils/helpers';
import { GenieAiInfoTooltip } from '../GenieAiInfoTooltip';

const ScoreDetails = GenieMapProps(({sidebar}) => {
    const { wordStats, headingStats, paragraphStats, imageStats } = sidebar.analyzedContent?.allStats;
    let stats = [
        {
            statsData: wordStats,
            title: "Words",
            color: ['#9AD6A7', '#D5FBD2']
        },
        {
            statsData: headingStats,
            title: "Headings",
            color: ['#C5E9F2', '#E6F5F9']
        },
        {
            statsData: paragraphStats,
            title: "Paragraphs",
            color: ['#FFCDA4', '#FEE7D4']
        },
        {
            statsData: imageStats,
            title: "Images",
            color: ['#ED786B', '#F4C8C4']
        }
    ]

   

    return (
        <div className="getgenie-statistics-score-details">
            <Row gutter={[0, 16]}>
                {stats.map((stat, index) => (
                    <Col key={index} span={12}>
                        <div className='getgenie-statistics-score-content'>
                           <div className='sc-container'>
                            <div className="item">
                                    <Progress
                                        width={30}
                                        strokeColor={stat.color[1]}
                                        strokeWidth={15}
                                        percent={100} success={{ percent: stat.statsData?.targetCompletion || 0, strokeColor: stat.color[0] }}
                                        type="circle"
                                    />
                                    <div className='output'>
                                        <h6 className="title">
                                            {stat?.title}
                                        </h6>
                                        <h5 className="value" style={{color:  GenieHelpers.colorByStatScore(stat.statsData?.targetCompletion || 0)}}>{stat?.statsData?.count}</h5>
                                    </div>
                                </div>
                                <div className={`label ${(stat?.title || '').toLowerCase()}`}>
                                    <GenieAiInfoTooltip className={'getgenie-statistics-score-tooltip'} 
                                        placement={"bottom"} 
                                        title={`Your blog should consist of ${(Object.keys(stat.statsData).length===0 ? '' : stat.statsData.formatAvgMax(" to "))} 
                                            ${(stat?.title || '').toLowerCase()} according to your settings`} />
                                    <div className='output'>
                                        <h6 className="title">Recommended</h6>
                                        <span className="value">{(Object.keys(stat.statsData).length===0 ? '' : stat.statsData.formatAvgMax("-"))}</span>
                                    </div>
                                </div>
                           </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    )
}, ['sidebar'])

export default ScoreDetails;