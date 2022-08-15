import { Column } from '@ant-design/plots';
import { Empty } from 'antd';
const { memo } = wp.element

const SearchVolumeChart = memo(({ data }) => {
    const config = {
        data,
        height: 280,

        autoFit: true,
        xField: 'date',
        yField: 'volume',
        appendPadding: [20, 0, 0, 0],
        label: {
            position: 'top',
            rotate: 11,
            offsetX: 5,
            offsetY: 5,
            style: {
                fill: '#7999D0',
                fontSize: 10
            },
            content: (originData) => {
                return originData.volume > 1000 ? `${(originData.volume / 1000).toFixed(1)}K` : originData.volume
            }
        },
        line: {
            style: {
                lineDash: [4, 5]
            }
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        columnStyle: {
            fill: '#DBE7FD',
        },
        // interactions: [
        //     {
        //         type: "active-region",
        //         enable: false,
        //     },
        // ]
    };
    return (
        data.length === 0 ?
            <Empty description={`No Search Volume Trend data found`} className="getgenie-chart empty" />
            :
            <Column className="getgenie-chart" {...config} />
    )
});

export { SearchVolumeChart }
