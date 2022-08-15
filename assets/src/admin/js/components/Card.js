import { Card, Col, Row } from "antd";
import { GenieMapProps } from "../map-props";
const { useState, useEffect } = wp.element;
const GenieCard = GenieMapProps(({ list, children, column = 1, handleClick, sidebar, setSidebar, skeleton: Skeleton = null, showActiveItem = false, loading = false, value = '', ...props }) => {
    const [card, setCard] = useState(null);
    /** define columns for responsiveness */
    let cols = 24 / column;

    if (column > 2) {
        cols = 24 / (column - 2);
    }
    else if (column > 1) {
        cols = 24 / (column - 1);
    }

    useEffect(() => {
        /** if previous selected content available, update the card. (for title, intro screen) */
        if (showActiveItem && value) {
            const content = list.findIndex(item => item.title === value)
            if (content !== -1) {
                setCard(content + '-selected')
            }
        }
    }, [])

    const handleCard = (e, item, index) => {
        setCard(index + '-selected');

        /** pass event and item to callback */
        if (handleClick) {
            handleClick(e, item);
        }
    }


    useEffect(() => {
        /** clear previous selected card on change of card list */
        if (list.length === 0) {
            setCard(null)
        }
    }, [list])

    if (Skeleton) { return <Skeleton /> }
    /** each list should have an unique id */
    return (
        <div className="getgenie-card">
            <Row gutter={16}>
                {list.map((item, index) =>
                    <Col xs={24} sm={cols} xl={24 / column} key={index}>
                        <Card
                            className={(card && (card === (index + '-selected'))) ? 'active' : ''}
                            key={index} onClick={(e) => handleCard(e, item, index)}
                            {...props}>{children(item)}
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    )
}, ['sidebar', 'setSidebar']);

export default GenieCard