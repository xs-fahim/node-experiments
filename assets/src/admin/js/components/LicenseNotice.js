import { Alert, Button, Space } from "antd";



const LicenseNotice = () => {

    const activated = window.getGenie.config?.siteToken;

    
        return ''
    

    return (
        <Alert
            message="Warning!"
            description="I've noticed that you haven't activated the Pro/Free license yet. Click the button below to unleash my magic. Sincerely — GetGenie AI"
            type="warning"
            className="getgenie-license-notice"
            action={
                <Space direction="vertical">
                    <Button size="small" type="primary" href="https://app.getgenie.ai/license/?product=free-trial" target="_blank">
                        Claim your license
                    </Button>
                    <Button size="small" primary href="#license">
                        Finish setup with your license
                    </Button>
                </Space>
            }
            showIcon
            closable
        />
    )
}

export default LicenseNotice