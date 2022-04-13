import React, { Component, useEffect, useState } from "react";
import { Modal, Button, Form, Select, InputNumber, notification, DatePicker, Checkbox } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import axios from "axios";

// import "./main.scss"; // webpack must be configured to do this
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllSales } from "../../actions/salesActions";

const { Option } = Select;

const AddSale = (props) => {
    const dispatch = useDispatch();
    const { books } = useSelector(redux => redux.books)
    const [form] = Form.useForm();
    const [show, setShow] = useState(false);

    const onShow = () => {
        setShow(true)

    }
    const onClose = () => {
        setShow(false)
    }


    let bookList = (books).map(book => {
        let result = {};
        result.name = book.name;
        result.label = book.name;
        result.value = book.id;
        return result;
    });
    bookList = bookList.sort(function (a, b) {
        let x = a.name;
        let y = b.name;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    const locations = [
        {
            label: "Main Center",
            value: "Main Center"
        },
        {
            label: "UMassD",
            value: "UMassD"
        }
    ]

    const addSale = (saleData) => {
        return axios
            .post("api/sales", saleData)
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

    const onSubmit = () => {
        form
            .validateFields()
            .then(values => {
                addSale(values)
                    .then(res => {
                        if (res.success === true) {
                            dispatch(getAllSales());
                            setShow(false);
                            form.resetFields();
                            notification['success']({
                                message: 'Sucess',
                                description:
                                    'Sale Succesfully Added.',
                            });
                        }
                    })
                    .catch(err => {
                        notification['error']({
                            message: 'Error!',
                            description:
                                'Something went wrong. Please try again.',

                        });
                    });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }


    return (<>
        <Button
            type="primary"
            shape="round"
            icon={<UploadOutlined />}
            onClick={onShow}>
            Add Sale
        </Button>
        <Modal title={'Add Sale'} visible={show} onCancel={onClose} onOk={onSubmit}>
            <Form
                layout="horizontal"
                form={form}
            >
                <Form.Item label="Select Book" name="bookId"
                    rules={[{ required: true, message: "Please select a Book!" }]}>
                    <Select showSearch placeholder="Select Book" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                        {bookList.map(book => {
                            return < Option key={book.label} value={book.value}>{book.label}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Select Center" name="location"
                    rules={[{ required: true, message: "Please select a Center!" }]}>
                    <Select placeholder="Select Center">
                        {locations.map(location => {
                            return < Option key={location.label} value={location.value}>{location.label}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Date" name="date" defaultValue={0}
                    rules={[{ required: true, message: "Please select Date!" }]}>
                    <DatePicker/>
                </Form.Item>
                <Form.Item label="" name="isEBook" valuePropName="checked">
                    <Checkbox>eBook</Checkbox>
                </Form.Item>
                <Form.Item label="Price" name="price" defaultValue={0}
                    rules={[{ required: true, message: "Please select Price!" }]}>
                    <InputNumber min={0} max={100000} defaultValue={0} />
                </Form.Item>
                <Form.Item label="Quantity" name="quantity" defaultValue={0}
                    rules={[{ required: true, message: "Please select Quantity!" }]}>
                    <InputNumber min={0} max={100000} defaultValue={0} />
                </Form.Item>
                <Form.Item label="Total" name="total" defaultValue={0}
                    rules={[{ required: true, message: "Please select Total!" }]}>
                    <InputNumber min={0} max={100000} defaultValue={0} />
                </Form.Item>
            </Form>
        </Modal>
    </>)
}

export default AddSale;