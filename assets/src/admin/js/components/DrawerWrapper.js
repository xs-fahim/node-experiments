const { useState, useEffect } = wp.element;
import { Drawer } from 'antd';
import { GenieMapProps } from '../map-props';

const DrawerWrapper = GenieMapProps(({ children, sidebar, setSidebar }) => {
    /** set default width of sidebar */
    const [width, setWidth] = useState(380);
    const { open, generatedOutlines, analyzeKeyword } = sidebar;

    /**
     * @param {Event} e 
     * @desc update width of the sidebar on mouse drag in sidebar
     */
    const handleMouseDown = (e) => {
        e.preventDefault();

        jQuery(document).mousemove(function (e) {
            setWidth(window.innerWidth - (e.pageX + 2))
        })
    }
    const closeSidebar = () => {
        setSidebar({
            open: false
        })
    }


    useEffect(() => {
        /** set different sidebar width based on current panels */
        analyzeKeyword.open && !generatedOutlines.open && setWidth(710);

        generatedOutlines.open && !analyzeKeyword.open && setWidth(660);

        generatedOutlines.open && analyzeKeyword.open && setWidth(990);

        !generatedOutlines.open && !analyzeKeyword.open && setWidth(380);


    }, [sidebar.analyzeKeyword.open, sidebar.generatedOutlines.open])

    return (
        <div className='getgenie-drawer-wrapper'>
            <Drawer
                className="getgenie-drawer"
                width={width}
                onClose={closeSidebar}
                visible={open}
                closable={false}
                getContainer={'.getgenie-drawer-wrapper'}
                mask={!sidebar.globalTemplateMode}
            >

                {children(width)}
                <div className="xs-draggable" onMouseDown={handleMouseDown}></div>
            </Drawer>
        </div>
    )
}, ['sidebar', 'resetSidebar', "setSidebar"]);

export { DrawerWrapper }