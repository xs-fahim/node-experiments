
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const Loading = ({ fontSize = 35 }) => {
    const antIcon = <LoadingOutlined style={{ fontSize: fontSize }} spin />;
    return (
        <div className="getgenie-spin-center">
            <Spin indicator={antIcon} />
        </div>
    )
}

export default Loading;