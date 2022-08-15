import GaugeChart from 'react-gauge-chart'
import { Typography } from 'antd';
const { memo } = wp.element;
const ScoreMeter = memo(({ totalContentStats, imageUrl }) => {


    let score = totalContentStats?.result?.percent || 0;

    /** set chart logo based on score */
    let chartLogo = `${imageUrl}/red-smile.png`;

    if (score <= 0.25) {
        if (score > 0.23) {
            score -= 0.02
        }
        if (score <= 0.02) {
            score -= 0.02
        }
        chartLogo = `${imageUrl}/red-smile.png`
    }
    else if (score > 0.25 && score <= 0.5) {
        chartLogo = `${imageUrl}/yellow-smile.png`
    }
    else if (score > 0.5 && score < 0.80) {
        chartLogo = `${imageUrl}/green-smile.png`
    }
    else {
        if (score < 0.83) {
            score += 0.02
        }
        if (score >= 0.98) {
            score += 0.02
        }
        chartLogo = `${imageUrl}/dark-green-smile.png`
    }

    return (
        <div className="getgenie-statistics-score-meter">
            <GaugeChart id="gauge-chart3"
                nrOfLevels={4}
                colors={["#FF4131", "#FDC500", "#84C300", "#00B81D"]}
                percent={score}
                arcPadding={-1}
                cornerRadius={0}
                arcsLength={[0.25, 0.25, 0.30, 0.20]}
                arcWidth={.4}
                hideText={true}
                needleColor="#545359"
            />
            <div className="chartLabel">
                <img src={chartLogo} alt="chart logo" />
            </div>
            <div className="meterText">
                <Typography.Text >{totalContentStats?.result?.count}/</Typography.Text>
                <Typography.Text >100</Typography.Text>
            </div>
        </div>
    )
})

export default ScoreMeter;