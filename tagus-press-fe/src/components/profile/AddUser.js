import React, { Component, useEffect, useState } from "react";
import { Modal, Button, Form, Select, Input, notification, Checkbox } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import axios from "axios";

// import "./main.scss"; // webpack must be configured to do this
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks, getAllBookSeries } from "../../actions/booksActions";

const { Option } = Select;

const AddUser = (props) => {
    const [form] = Form.useForm();
    const [show, setShow] = useState(false);

    const onShow = () => {
        setShow(true)
    }
    const onClose = () => {
        setShow(false)
    }

    const addUser = (bookData) => {
        return axios
            .post("api/users/", bookData)
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
                addUser(values)
                    .then(res => {
                        if (res.success === true) {
                            setShow(false);
                            form.resetFields();
                            notification['success']({
                                message: 'Sucess',
                                description: "User Succesfully added.",
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
            size="large"
            onClick={onShow}
        >
            Add User
        </Button>
        <Modal title={'Add User'} visible={show} onCancel={onClose} onOk={onSubmit}>
            <Form
                layout="horizontal"
                form={form}
            >
                <Form.Item label="First Name" name="first_name"
                    rules={[{ required: true, message: "Please enter the First Name!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Last Name" name="last_name"
                    rules={[{ required: true, message: "Please enter the Last Name!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email"
                    rules={[{ required: true, message: "Please enter the Email!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password"
                    rules={[{ required: true,  message: "Please enter the password!" }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="" name="is_admin" valuePropName="checked">
                    <Checkbox>Admin</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    </div>)
}

export default AddUser;
