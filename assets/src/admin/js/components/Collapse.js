import { Collapse } from "antd"
const { Panel } = Collapse;

const GenieCollapse = ({children, ...props}) => {
    return (
        <Collapse {...props} expandIconPosition="right" expandIcon={(panelProps) => <span className="getgenie-icon-chevron_down"></span>}>
            {children}
        </Collapse>
    )
}

GenieCollapse.Panel = ({children, ...props}) => {
    return (
        <Panel {...props}>
            {children}
        </Panel>
    )
}

export { GenieCollapse }