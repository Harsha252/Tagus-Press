import React, { useState } from "react";
import { Table, Input, InputNumber, Form, Popconfirm, Button, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";

import axios from "axios";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                    children
                )}
        </td>
    );
};

const PeriodicalCostsTable = (props) => {
    const { periodicalCosts } = props;

    const periodicalCostsTable = periodicalCosts.map(periodicalCost => {
        return {
            key: periodicalCost.id,
            book: periodicalCost.name,
            first_edition: periodicalCost.first_edition,
            published: periodicalCost.published,
            royalty: periodicalCost.royalty,
            author_translator_literary: periodicalCost.author_translator_literary,

        }
    })

    const [form] = Form.useForm();
    const [data, setData] = useState(periodicalCostsTable);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            first_edition: '',
            published: '',
            royalty: '',
            author_translator_literary: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const updatePeriodicalCosts = (costData) => {
        return axios
            .post("api/periodical-costs/modify", costData)
            .then(res => {
                return {
                    success: true
                }
            })
            .catch(err => {
                console.log(err.response.data);
                notification['error']({
                    message: 'Error',
                    description: err.response.data.errors[0],
                });
                return {
                    success: false
                }
            });
    }

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                let editedRowData = { ...item, ...row };
                updatePeriodicalCosts(editedRowData).then(res => {
                    if (res.success === true) {
                        newData.splice(index, 1, editedRowData);
                        setData(newData);
                        setEditingKey('');
                        notification['success']({
                            message: 'Sucess',
                            description: "Periodical Costs Succesfully Updated.",
                        });
                    }
                })
                    .catch(err => {
                        notification['error']({
                            message: "Error!",
                            description: "Something went wrong. Please try again.",
                        });
                    });
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


    const columns = [
        {
            title: 'Book',
            dataIndex: 'book',
            key: 'book'
        },
        {
            title: 'First Edition',
            dataIndex: 'first_edition',
            key: 'first_edition',
            editable: true
        },
        {
            title: 'Published Price',
            dataIndex: 'published',
            key: 'published',
            editable: true
        },
        {
            title: 'Royalty',
            dataIndex: 'royalty',
            key: 'royalty',
            editable: true
        },
        {
            title: 'Author/Translator/Literary',
            dataIndex: 'author_translator_literary',
            key: 'author_translator_literary',
            editable: true
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            width: 120,
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
            </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                        <Button icon={<EditOutlined />} type="link" disabled={editingKey !== ''} onClick={() => edit(record)} />
                        // <a style={{color: "blue"}} disabled={editingKey !== ''} onClick={() => edit(record)}>
                        //   Edit
                        // </a>
                    );
            },
        },
    ]

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                dataSource={data}
                columns={mergedColumns}
                bordered
            />
        </Form>
    );
}

export default PeriodicalCostsTable;
