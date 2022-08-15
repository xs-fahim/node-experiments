import { Tooltip } from "antd"


export const GenieAiInfoTooltip = ({ title, placement, className = '' }) => {
  return (
    <Tooltip className="getgenie-tooltip-icon dashicons dashicons-info-outline" placement={placement} title={title} overlayClassName={className}>

    </Tooltip>
  )
}
