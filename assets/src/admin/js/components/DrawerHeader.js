import { Button, Col, Row } from 'antd';
import { GenieMapProps } from '../map-props';

const DrawerHeader = GenieMapProps(({ sidebar, setSidebar, getInputs, setInput }) => {
    const {imageUrl} = sidebar;
    const seoData = getInputs['searchVolume'];
    const seoEnabled = getInputs['seoEnabled'];

    const handleClickSeoBtn = () => {
        setInput('seoEnabled', !seoEnabled)
    }
    const closeSidebar = () => {
        setSidebar({
            open: false
        })
    }
    return (
        <div className='getgenie-sidebar-header'>
            <Row>
                <Col span={20}>
                    <img className='main-logo' src={`${imageUrl}/Genie_logo_black.svg`} alt="logo" />
                    {(((sidebar.component === "IntroScreen" || sidebar.component === "OutlineScreen"))
                        && seoData) ?
                        <Button onClick={handleClickSeoBtn} shape='round' className="getgenie-sidebar-header-seoBtn">
                            <img src={`${imageUrl}/badge.png'`} alt="logo" />
                            SEO {seoEnabled ? 'Enabled' : 'Disabled'}
                        </Button> : <div className='empty-btn-space'></div>}
                </Col>
                <Col span={4} className="getgenie-close-btn">
                    <span onClick={closeSidebar}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.00714L8.99286 0L5 3.99286L1.00714 0L0 1.00714L3.99286 5L0 8.99286L1.00714 10L5 6.00714L8.99286 10L10 8.99286L6.00714 5L10 1.00714Z" fill="#323232" />
                        </svg>
                    </span>
                </Col>
            </Row>
        </div>
    )
}, ['setSidebar', 'sidebar', 'getInputs', 'setInput']);

export { DrawerHeader };