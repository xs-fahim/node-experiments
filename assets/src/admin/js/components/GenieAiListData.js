import { Divider, Typography } from "antd"


const GenieAiListData = ({ data }) => {

    return (
        <>
            <div className="getgenie-list-data">
                {
                    data.map((item, index) =>
                        <>
                            <div className="getgenie-list-data-container">
                                <Typography.Title level={5} className="getgenie-list-data-title">{item.title}</Typography.Title>
                                <Typography.Title level={5} className="getgenie-list-data-value">{item.value}</Typography.Title>
                            </div>
                            {(index !== data.length - 1) && <Divider />}
                        </>
                    )
                }
            </div>
        </>
    )
}

export { GenieAiListData }