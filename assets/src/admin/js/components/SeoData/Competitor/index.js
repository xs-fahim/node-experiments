import { Button, Card, Checkbox, Col, Divider, Row, Typography } from 'antd';
import { GenieMapProps } from '../../../map-props'
import { GenieCollapse } from '../../Collapse';
import { GenieAiPopover } from '../../GenieAiPopover'

const Competitor = GenieMapProps(({ loading, getInputs, setInput, sidebar }) => {

    let selectedOutlines = getInputs['selectedOutlines'] || [];
    let competitorData = getInputs['competitorData'];

    const onChange = (e, text) => {

        let items = [...selectedOutlines];
        if (items.indexOf(text) != -1) {
            items.splice(items.indexOf(text), 1)
        } else {
            items.push(text)
        }
        setInput('selectedOutlines', items);
    }
    /**
     * @param {string} content
     * @description find all a tag in content to set its target attribute 
     * @returns html string
     */
    const htmlDecode = (content) => {
        let e = document.createElement('div');
        e.innerHTML = content;

        e.querySelectorAll('a').forEach(item => {
            item.setAttribute('target', '_blank');
        })

        return e.innerHTML;
    }
    return (
        loading ?
            <h5 className='getgenie-loading-state'>{loading}</h5>
            :
            <div className="getgenie-competitor-tab">
                {competitorData &&
                    competitorData.length === 0 ?
                    <Typography.Title level={5} className="getgenie-not-found-title">
                        No related data was found.
                    </Typography.Title>
                    :
                    competitorData.map((item, index) => <>
                        <Row className="getgenie-competitor-overview" gutter={8}>
                            <Col className="gutter-row" >
                                <div className="getgenie-text">Rank: {item?.rank}</div>
                            </Col>
                            <Col className="gutter-row" >
                                <div className="getgenie-text">Words: {item?.wordCount}</div>
                            </Col>
                            <Col className="gutter-row" >
                                <div className="getgenie-text">Heading: {item?.numberOfHeadings}</div>
                            </Col>
                            <Col className="gutter-row" >
                                <div className="getgenie-text">Images: {item?.numberOfImage}</div>
                            </Col>
                        </Row>

                        <Card className="getgenie-competitor-card">
                            <a href={item?.url} className="getgenie-competitor-link" target="_blank">
                                {(item?.favicon && item?.favicon.indexOf('localhost') === -1 )?
                                    <img className='page-favicon' src={item?.favicon} />
                                    :
                                    <span className="page-url dashicons dashicons-admin-site-alt3"></span>}

                                <span className='page-url'>{item?.url}</span>
                            </a>

                            <Typography.Title level={5} className="getgenie-competitor-title">
                                {item.title}
                            </Typography.Title>

                            <p className="getgenie-competitor-text" dangerouslySetInnerHTML={{ __html: htmlDecode(item?.description) }}></p>
                            <GenieAiPopover content={
                                <div className="getgenie-tags-popover">
                                    <GenieCollapse collapsible="header" showArrow={false} accordion>
                                        {item?.content?.map((content, index) => (<>
                                            {
                                                sidebar.component === 'OutlineScreen' ?

                                                    <GenieCollapse.Panel header={
                                                        <>
                                                            <div className="getgenie-competitor-tag-container" onClick={(e) => e.stopPropagation()}>
                                                                <Checkbox checked={selectedOutlines.indexOf(content.title) != -1} onChange={e => onChange(e, content.title)}>
                                                                    <div className='tag-content' onClick={(e) => e.stopPropagation()}>
                                                                        <h5 className="tag-name">{content?.tag}</h5>
                                                                        <h5 className="tag-title">{content?.title}</h5>
                                                                    </div>
                                                                </Checkbox>
                                                            </div>
                                                            <span className="custom-collapse-icon getgenie-icon-chevron_down"></span>
                                                        </>
                                                    } key={index}>
                                                        <p dangerouslySetInnerHTML={{ __html: htmlDecode(content?.text) }}></p>
                                                    </GenieCollapse.Panel>
                                                    :
                                                    <GenieCollapse.Panel header={
                                                        <div className="getgenie-competitor-tag-container">
                                                            <div className='tag-content' onClick={(e) => e.stopPropagation()}>
                                                                <h5 className="tag-name">{content?.tag}</h5>
                                                                <h5 className="tag-title">{content?.title}</h5>
                                                            </div>
                                                            <span className="custom-collapse-icon getgenie-icon-chevron_down"></span>
                                                        </div>
                                                    } key={index}>
                                                        <p dangerouslySetInnerHTML={{ __html: htmlDecode(content?.text) }}></p>
                                                    </GenieCollapse.Panel>

                                            }
                                        </>)

                                        )}
                                    </GenieCollapse>
                                </div>
                            }
                                overlayStyle={{
                                    width: "500px",
                                    height: "350px"
                                }}
                                overlayClassName="getgenie-competitor-popover"
                                placement="left">
                                <div className="getgenie-competitor-tag">
                                    <div className="getgenie-competitor-tag-list">
                                        <Typography.Title level={5} className="getgenie-competitor-tag-name">{item?.content[0]?.tag}</Typography.Title>
                                        <Typography.Title level={5} className="getgenie-competitor-tag-content">{item?.content[0]?.title}</Typography.Title>
                                    </div>
                                    <Button disabled={item?.content?.length === 0} className="getgenie-competitor-tag-moreBtn" type="link">more details
                                        <span className="getgenie-icon-arrow"></span>
                                    </Button>
                                </div>
                            </GenieAiPopover>

                        </Card >
                        {index !== competitorData.length - 1 && <Divider />}
                    </>)
                }
            </div>



    )
}, ['sidebar', 'getInputs', 'setInput']);

export { Competitor }