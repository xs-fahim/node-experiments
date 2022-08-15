import { Col, Input, Row } from "antd";
import { GenieMapProps } from "../../map-props";
import GenieCard from "../Card";
const { useEffect, useState } = wp.element
import GenieAiMenuHeader from "../GenieAiMenuHeader";

const WriteForMe = GenieMapProps(({ setSidebar, sidebar, templates }) => {
    const [list, setList] = useState(templates.list);

    useEffect(() => {
        setList(templates.list)
    }, [templates.list])

    useEffect(() => {
        /** disable wp body scroll while sidebar is open */
        if (sidebar.open) {
            document.body.classList.add('disable-scroll')
        }
        else {
            if (document.body.classList.contains('disable-scroll')) {
                document.body.classList.remove('disable-scroll')
            }
        }

    }, [sidebar.open])

    /**
     * @function
     * @param {Event} e 
     * @param {Object} item properties of clicked content
     * @desc update the current template
     */
    const handleClick = (e, item) => {
        let component = 'WriteTemplatesScreen'
        setSidebar({
            open: true,
            enableFooter: false,
            component,
            currentTemplate: item.templateSlug
        });
    }
    const handleSearchTemplate = (e) => {
        let searchInput = e.target.value.toLowerCase();
        let updatedTemplates = templates.list.filter(item => (
            item.title.toLowerCase().includes(searchInput) ||
            item.description.toLowerCase().includes(searchInput)
        ))

        setList(updatedTemplates)
    }
    return (
        <>
            <GenieAiMenuHeader />
            <div className="getgenie-info-wrapper">
                <div className="getgenie-dashboard-templates getgenie-license-page">
                    <Row>
                        <Col span={24} md={16}>
                            <h5 className="getgenie-title">Write Using Templates</h5>
                        </Col>
                        <Col span={24} md={8}>
                            <Input
                                onChange={handleSearchTemplate}
                                bordered={false}
                                className="template-search"
                                placeholder="Search..."
                                suffix={
                                    <span className="getgenie-icon-search"></span>
                                }
                            />
                        </Col>
                    </Row>


                    {list.length === 0 ?
                        <h4 className="getgenie-not-found-title">
                            No template found
                        </h4>
                        :
                        <GenieCard list={list} column={4} handleClick={handleClick}>{
                            (item) => {
                                return <>
                                    <h5 className="template-title">{item.title}</h5>
                                    <p className="template-description">{item?.description}</p>
                                </>
                            }
                        }</GenieCard>
                    }
                </div>
            </div>


        </>
    )
}, ['setSidebar', 'sidebar', 'templates']);

export default WriteForMe;