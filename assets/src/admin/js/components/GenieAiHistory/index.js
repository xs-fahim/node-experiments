import { Form, Row, Tooltip, Typography } from "antd";
const { useEffect, useState } = wp.element;
import { GenieRequestApi } from "../../api-request";
import { GenieMapProps } from "../../map-props";
import GenieAiMenuHeader from "../GenieAiMenuHeader";
import GenieAiTable from "../GenieAiTable";
import { GenieAiModal } from "../GenieAiModal";
import processResponse from "../../utils/processResponse";
import { GenieHelpers } from "../../utils/helpers";

const GenieAiHistory = GenieMapProps(({ setInput, getInputs }) => {
    const [clickedRow, setClickedRow] = useState({});

    const [historyDataList, setHistoryDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showRowData, setShowRowData] = useState(false);
    const [users, setUsers] = useState([])
    const [showClearBtn, setShowClearBtn] = useState(false)
    const [showTooltip, setShowTooltip] = useState(null)


    const getHistoryData = () => {
        GenieRequestApi.historyData((res) => {
            processResponse(res, () => {
                setHistoryDataList(res.data.history);
            })
            setLoading(false);
        });
    }

    useEffect(() => {
        getHistoryData();
    }, [])

    const columns = [
        {
            title: "Template Name",
            dataIndex: "templateTitle",
            key: "templateTitle",
            width: '25%'
        },
        {
            title: "Input",
            dataIndex: "input",
            key: "input",
            responsive: ['sm'],
            render: (data) => {
                if (typeof data == 'string') {
                    return data
                }
                let input = '';
                for (const [key, value] of Object.entries(data)) {
                    let result = key.replace(/([A-Z])/g, " $1");
                    let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                    input += `<strong>${finalResult}:</strong> ${value}; `;
                }

                return <span key="${key}" dangerouslySetInnerHTML={{ __html: input }}></span>
            }
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: '20%',
            responsive: ['md']
        },
    ];

    /**
     * 
     * @param {object} r - user clicked row data as object
     * @return an onclick method to update state variables
     */
    const rowData = (r) => ({
        onClick: () => {
            setShowRowData(true);
            setClickedRow(r);
            setIsModalVisible(true);
        }
    })

    const loadMoreData = () => {
        setLoading(true);
        setCurrentPage(currentPage + 1);
        getHistoryData();

    }


    /** load user list using API call */
    const loadOptions = (inputValue) => {
        GenieRequestApi.userList((res) => {
            processResponse(res, () => {
                setUsers([...users, ...res.data.list])
            })
        }, {
            userId: inputValue
        });
    };

    /** throttling for input change to call api */
    let interval;
    const handleSelectInputChange = input => {
        setLoadingUser(true)

        if (interval) {
            clearInterval(interval)
        }

        interval = setTimeout(() => {
            setLoadingUser(false)
            let updatedUsers = [...users, {
                value: input,
                label: input
            }]
            updatedUsers = updatedUsers.filter((item, index, array) => {
                return array.findIndex(t => t.value == item.value && t.label == item.label) == index
            });
            setUsers(updatedUsers)
        }, 3000)
    }

    const clearInputs = () => {
        setInput('searchInput', '')
        setInput('dateRange', [])
        setInput('selectedUser', '')
        setShowClearBtn(false);
    }

    const onFinish = () => {
        setLoading(true);

        let data = {}
        data.page = currentPage;
        data.perPage = 20;
        data.searchKeyword = getInputs['searchInput'] || '';
        data.dateRange = (getInputs["dateRange"] || []).join('-');
        data.wpUser = getInputs['selectedUser'] || '';

        setCurrentPage(1)

        GenieRequestApi.historyData((res) => {
            processResponse(res, () => {
                setHistoryData(res.data.list)
            })
        }, {

        }
        );
        setTimeout(() => {
            setLoading(false);
        }, 2000);

        clearInputs()
        setShowClearBtn(false);
    }
    const copyTextAction = (value) => {

        document.querySelectorAll('.ant-tooltip').forEach(item => item.style.visibility = 'visible')

        let copyAbleText = value.replace(/<br\/>/g, "")


        GenieHelpers.copyToClipboard(copyAbleText)
            .then(() => {
                setShowTooltip(value);

                setTimeout(() => {
                    setShowTooltip(null)
                }, 2000);
            })
            .catch(() => console.log('Error while copying.'));

    }

    const hideTooltip = () => {
        document.querySelectorAll('.ant-tooltip').forEach(item => item.style.visibility = 'hidden')
    }


    useEffect(() => {
        if (getInputs["searchInput"]?.length || getInputs["dateRange"]?.length || getInputs["selectedUser"]) {
            setShowClearBtn(true)
        }
        else {
            setShowClearBtn(false)
        }
    }, [getInputs['searchInput'], getInputs['dateRange'], getInputs['selectedUser']])

    return (
        <>
            <GenieAiMenuHeader />
            <div className="getgenie-info-wrapper">
                <div className="getgenie-history">
                    <Form layout="vertical" onFinish={onFinish}>
                        <Typography.Title level={2}>Genie's History</Typography.Title>
                        {/* <Row className="getgenie-filter" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <GenieInput name="searchInput" className="searchInput" placeholder="Search something" />
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <DateRangePicker name="dateRange" required={true} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <GenieSelect label="Select Templates" name="selectedUser"
                                    onSearch={handleSelectInputChange}
                                    options={users}
                                    placeholder="Select an user"
                                    loading={loadingUser} />
                            </Col>

                            <Col className="gutter-row btn-container" span={8}>
                                <GenieButton htmlType="submit" loading={loading} className="getgenie-search-btn"
                                    disabled={!(getInputs["searchInput"] || getInputs["dateRange"]?.length > 0 || getInputs["selectedUser"])}
                                >Search</GenieButton>
                                {showClearBtn &&
                                    <Col className="gutter-row" span={12}>
                                        <Button type="link" onClick={clearInputs} icon={<DeleteOutlined />} className="getgenie-clear-btn" >Clear Filter</Button>
                                    </Col>
                                }
                            </Col>
                        </Row> */}
                        {/* <Spin tip="Loading..." spinning={loading}>
                            <div className="getgenie-table">
                                <GenieAiTable rowData={rowData} columns={columns} dataSource={historyDataList} />
                            </div>

                            <Button primary className="getgenie-load-more-btn" onClick={loadMoreData}>Load More</Button>
                        </Spin> */}

                        <div className="getgenie-table">
                            <GenieAiTable rowData={rowData} columns={columns} dataSource={historyDataList} pagination />
                        </div>

                        {showRowData &&
                            <GenieAiModal className="getgenie-history-modal"
                                closeIcon={<span className="getgenie-icon-close"></span>}
                                isModalVisible={isModalVisible}
                                setIsModalVisible={setIsModalVisible}
                                onClose={hideTooltip}
                                centered={true} footer={null}>
                                <div className="getgenie-modal-date">
                                    {/* <h5 className="gg-label">User: <span className="gg-value">{clickedRow?.user}</span></h5> */}
                                    <h5 className="gg-label">Template Name: <span className="gg-value">{clickedRow?.templateTitle}</span></h5>
                                    <h5 className="gg-label">Creativity Level: <span className="gg-value">{clickedRow?.creativityLevel}</span></h5>
                                    <h5 className="gg-label">Created at: <span className="gg-value">{clickedRow?.date}</span></h5>
                                </div>
                                <div className="getgenie-modal-contents">
                                    <Typography.Title level={3} className="getgenie-modal-label">Keyword Input</Typography.Title>

                                    {typeof clickedRow.input == 'string' ?
                                        <div className='getgenie-text genieText'>{clickedRow.input}</div>
                                        :
                                        Object.values(clickedRow.input).map((item, index) => <div key={index} className='getgenie-text genieText'>
                                            <span dangerouslySetInnerHTML={{ __html: item }}></span>
                                            <Tooltip placement="right" title={(showTooltip === item) && "Copied"} visible={(showTooltip === item) && isModalVisible}>
                                                <span className="getgenie-icon-copy" onClick={() => { copyTextAction(item); }} ></span>
                                            </Tooltip>
                                        </div>
                                        )}
                                </div>
                                <div className="getgenie-modal-contents">
                                    <Typography.Title level={3} className="getgenie-modal-label">Generated Content{clickedRow.output.length < 1 ? ': 0' : ''}</Typography.Title>

                                    {clickedRow.output.map((item, index) => <div key={index} className='getgenie-text genieText'>
                                        <span dangerouslySetInnerHTML={{ __html: item }}></span>
                                        <Tooltip placement="right" title={(showTooltip === item) && "Copied"} visible={(showTooltip === item) && isModalVisible}>
                                            <span className="getgenie-icon-copy" onClick={() => { copyTextAction(item); }} ></span>
                                        </Tooltip>
                                    </div>
                                    )}
                                </div>
                            </GenieAiModal>
                        }
                    </Form>
                </div>
            </div>
        </>
    );
}, ["getInputs", "setInput"])

export default GenieAiHistory