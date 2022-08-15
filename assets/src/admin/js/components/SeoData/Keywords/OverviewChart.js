import { Divider, Radio, Typography } from "antd"
const { useState, useEffect } = wp.element
import { GenieMapProps } from "../../../map-props";
import GoogleTrendChart from "./GoogleTrendChart";
import { SearchVolumeChart } from "./SearchVolumeChart";

const OverviewChart = GenieMapProps(({ getInputs }) => {
    const [currentTab, setCurrentTab] = useState('searchVolTrend')
    const [data, setData] = useState([])

    useEffect(() => {
        if (getInputs['searchVolume']?.chart?.[currentTab]) {
            setData(getInputs['searchVolume'].chart[currentTab])
        }
        else {
            setData([])
        }

    }, [getInputs['searchVolume']])

    return (
        <>
            <div className="getgenie-seo-result-chart-container">
                <Typography.Title level={5} className="getgenie-title">Overview Chart</Typography.Title>
                <div className="genie-nav-container">
                    <Radio.Group defaultValue={currentTab} onChange={e => setCurrentTab(e.target.value)}>
                        <Radio.Button value="searchVolTrend">Search Vol. Trend</Radio.Button>
                        <Radio.Button value="googleTrend">Google Trends</Radio.Button>
                    </Radio.Group>
                </div>
                <Divider />

                <div style={{ display: currentTab !== 'searchVolTrend' ? 'none' : 'initial' }}>
                    <SearchVolumeChart data={data} />
                </div>
                <div style={{ display: currentTab === 'searchVolTrend' ? 'none' : 'initial' }}>
                    <GoogleTrendChart data={getInputs['searchVolume']?.keyword || ''} />
                </div>
            </div>
        </>
    )
}, ['getInputs']);

export { OverviewChart }