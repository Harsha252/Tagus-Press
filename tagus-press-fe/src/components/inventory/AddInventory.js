import React, { Component, useEffect, useState } from "react";
import { Modal, Button, Form, Select, InputNumber, notification} from "antd";
import { UploadOutlined } from '@ant-design/icons';

import axios from "axios";

// import "./main.scss"; // webpack must be configured to do this
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllInventory } from "../../actions/inventoryActions";


const { Option } = Select;

const AddInventory = (props) => {
    const dispatch = useDispatch();
    const {books} = useSelector(redux => redux.books)
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

    const addInventory = (inventoryData) => {
        return axios
            .post("api/inventory", inventoryData)
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
                addInventory(values)
                .then(res => {
                    if (res.success === true) {
                        dispatch(getAllInventory());
                        setShow(false);
                        form.resetFields();
                        notification['success']({
                            message: 'Sucess',
                            description: "Inventory Succesfully Updated.",
                        });
                    } 
                })
                .catch(err => {
                    notification['error']({
                        message: "Error!",
                        description: "Something went wrong. Please try again.",
                    });
                });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }


    return (<div>
        <Button
            type="primary"
            icon={<UploadOutlined />}
            shape="round"
            onClick={onShow}
        >
            Add Inventory
        </Button>
        <Modal title={'Add Inventory'} visible={show} onCancel={onClose} onOk={onSubmit}>
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
                <Form.Item label="Select Inventory" name="inventory" defaultValue={0}
                rules={[{ required: true, message: "Please select Inventory!" }]}>
                <InputNumber min={-100000} max={100000} defaultValue={0} />
            </Form.Item>
        </Form>
    </Modal>
    </div>)
}

export default AddInventory;
