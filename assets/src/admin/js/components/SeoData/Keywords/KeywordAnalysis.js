import { Col, Row, Typography } from "antd"
import { GenieMapProps } from "../../../map-props";
import { GenieAiListData } from "../../GenieAiListData"

const KeywordAnalysis = GenieMapProps(({ getInputs }) => {

    const analysisData = getInputs['searchVolume'];

    const data = [
        { title: "Last Month", value: analysisData?.searchVolume?.lastMonth },
        { title: "Average 12 month", value: analysisData?.searchVolume?.avg12Month },
        { title: "Highest", value: analysisData?.searchVolume?.highest },
        { title: "Lowest", value: analysisData?.searchVolume?.lowest },
    ]

    return (
        <div className="getgenie-keyword-analysis">
            <Typography.Title level={4} className="getgenie-title">Keyword Analysis</Typography.Title>
            {analysisData ?
                <>
                    <Row gutter={6}>
                        <Col className="gutter-row" flex="auto">
                            <div className="getgenie-keyword-result volume">
                                <Typography.Title level={5} className="getgenie-title">Search Volume</Typography.Title>
                                <div className="getgenie-result-item">
                                    <Typography.Text className="getgenie-text">{analysisData?.searchVolume?.total}</Typography.Text>
                                    <span className="getgenie-icon-search"></span>
                                </div>
                            </div>
                        </Col>
                        <Col className="gutter-row" flex="auto">
                            <div className="getgenie-keyword-result competition">
                                <Typography.Title level={5} className="getgenie-title">Competition</Typography.Title>
                                <div className="getgenie-result-item">
                                    <Typography.Text className="getgenie-text">{analysisData?.searchVolume?.competition}</Typography.Text>
                                    <span className="getgenie-icon-competition"></span>
                                </div>
                            </div>
                        </Col>
                        <Col className="gutter-row" flex="auto">
                            <div className="getgenie-keyword-result cpc">
                                <Typography.Title level={5} className="getgenie-title">CPC</Typography.Title>
                                <div className="getgenie-result-item">
                                    <Typography.Text className="getgenie-text">{analysisData?.searchVolume?.cpc?.currency} {analysisData?.searchVolume?.cpc?.value}</Typography.Text>
                                    <span className="getgenie-icon-cpc"></span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <GenieAiListData data={data} />
                </>
                :
                <Typography.Title level={5} className="getgenie-not-found-title">
                    No magic found for this keyword. Maybe try a different one?
                </Typography.Title>
            }


        </div>
    )
}, ['getInputs']);

export { KeywordAnalysis }