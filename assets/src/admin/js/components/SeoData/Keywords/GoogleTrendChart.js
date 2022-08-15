import Loading from "../../Loading";

const { useState, memo, useEffect } = wp.element

const GoogleTrendChart = memo(({ data }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /** create trend chart url for iframe load */
        let keyword = encodeURIComponent(data);
        let modifiedUrl = `https://trends.google.com:443/trends/embed/explore/TIMESERIES?req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22#ENCODED_KEYWORD#%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22today%2012-m%22%7D%5D%2C%22category%22%3A0%2C%22property%22%3A%22%22%7D&tz=-360&eq=q%3D#DOUBLE_ENCODED_KEYWORD#%26date%3Dtoday%2012-m`
        modifiedUrl = modifiedUrl.replace('#ENCODED_KEYWORD#', keyword)
        modifiedUrl = modifiedUrl.replace('#DOUBLE_ENCODED_KEYWORD#', encodeURIComponent(keyword))
        setUrl(modifiedUrl)
    }, [])

    const onLoad = (e) => {
        /** show iframe if element is loaded fully */
        e.target.style.display = 'block';
        setLoading(false)
    };
    return (
        url &&
        <>
            <iframe onLoad={onLoad} id="trends-widget-1" title="trends-widget-1"
                src={url}
                className="getgenie-chart"
                frameborder="0" scrolling="0"
                style={{ height: '370px', width: '300px', padding: 0, display: 'none' }}>
            </iframe>
            {
                loading ?
                    <Loading />
                    :
                    ''
            }
        </>
    )
});

export default GoogleTrendChart;