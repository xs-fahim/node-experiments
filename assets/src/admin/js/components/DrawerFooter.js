import { Button, Tooltip } from "antd";
import { GenieMapProps } from "../map-props";

const DrawerFooter = GenieMapProps(({ sidebar, setSidebar, prevScreen, nextScreen, enableNextBtn, enableWriteBtn, loading = false, insertData = () => '' }) => {

    const handlePrev = () => {
        /** update sidebar properties on click prev button */
        sidebar.component === 'OutlineScreen' && setSidebar({
            generatedOutlines: {
                ...sidebar.generatedOutlines,
                open: false
            }
        });

        setSidebar({
            component: prevScreen
        });

    }
    const handleNext = () => {
        setSidebar({
            component: nextScreen
        });
    }

    return (
        <div className={`getgenie-sidebar-footer ${prevScreen && "getgenie-sidebar-footer-grid"}`}>
            {prevScreen && <Button type="primary" onClick={(handlePrev)} className="prevBtn"><span className="getgenie-icon-back_1"></span></Button>}
            <div className="btnGrp">
                {nextScreen && <Button type="primary" onClick={handleNext} disabled={!enableNextBtn} className="nextBtn">Next</Button>}

                {(enableWriteBtn === true || enableWriteBtn === false) &&

                    <Tooltip title="Insert selected outlines as headings" placement="topLeft">
                        <Button type="primary" onClick={insertData} size="small"
                            disabled={(!enableWriteBtn || loading)} className="insertBtn">
                            Insert
                        </Button>
                    </Tooltip>
                }
            </div>
        </div>
    )
}, ['sidebar', 'setSidebar']);

export { DrawerFooter }