import { Button, Col, Form, Input, Popconfirm, Row, Table, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GenieSelect } from './Select';

const GenieAiSettings = () => {
    const [dataSource, setDataSource] = useState([
        {
            key: '0',
            user: 'admin',
            words: <Input name="words" defaultValue={5000} />,
            serp: <Input name="serp" defaultValue={50} />,
            lookup: <Input name="lookup" defaultValue={100} />,
        }
    ]);
    const [count, setCount] = useState(2);

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns = [
        {
            title: 'User',
            dataIndex: 'user',
        },
        {
            title: 'Limit',
            children: [
                {
                    title: 'Words',
                    dataIndex: 'words',
                    key: 'words',
                    width: 200,
                    editable: true
                },
                {
                    title: 'Serp',
                    dataIndex: 'serp',
                    key: 'serp',
                    width: 200
                },
                {
                    title: 'Lookup',
                    dataIndex: 'lookup',
                    key: 'lookup',
                    width: 200
                }
            ]
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: 200,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Row justify="space-between">
                        <Col span={10}>
                            <Button type="primary" onClick={(e) => console.log(e, record)}>
                                Save</Button>
                        </Col>
                        <Col span={10}>
                            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                                <Button type="primary" danger >
                                    Delete</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData = {
            key: '1',
            user: 'admin',
            words: <Input name="words1" defaultValue={5000} />,
            serp: <Input name="serp1" defaultValue={50} />,
            lookup: <Input name="lookup1" defaultValue={100} />,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
    };
    const columns = defaultColumns.map((col) => {
        return {
            ...col,
            onCell: (record) => {
                return({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            })},
        };
    });
    return (
        <div className="getgenie-info-wrapper">
            <div className="getgenie-history">

                <Typography.Title level={2}>User Settings</Typography.Title>

                <Row>
                    <Col className="gutter-row" span={4}>
                        <GenieSelect label="Select Templates" name="selectedUser"
                            options={
                                [{
                                    "value": 1,
                                    "label": "admin 1"
                                },
                                {
                                    "value": 2,
                                    "label": "admin 2"
                                },
                                {
                                    "value": 3,
                                    "label": "admin 3"
                                }]
                            }
                            placeholder="Select an user"
                        />
                    </Col>

                    <Button
                        onClick={handleAdd}
                        type="primary"
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        Add new
                    </Button>
                </Row>

                <Table
                    
                    
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        </div>
    );
};

export default GenieAiSettings;