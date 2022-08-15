import GenieSidebar from './components/Sidebar';
import { ConfigProvider } from 'antd';


const Template = () => {
    return(
        <ConfigProvider  getPopupContainer={node => document.querySelector('.getgenie-main-container') || document.body}> {/** getPopupContainer: All popup related markup were render in the body instead in our wrapper, that's why used this. */}           

            {/** This is for Sidebar */}
            <GenieSidebar />
            
        </ConfigProvider>
    )
}



export default Template;