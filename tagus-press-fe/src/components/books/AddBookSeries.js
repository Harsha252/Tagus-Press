import React, { Component, useEffect, useState } from "react";
import { Modal, Button, Form, Select, Input, notification } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import axios from "axios";

// import "./main.scss"; // webpack must be configured to do this
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../../actions/booksActions";

const { Option } = Select;

const AddBookSeries = (props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [show, setShow] = useState(false);

    const onShow = () => {
        setShow(true)

    }
    const onClose = () => {
        setShow(false)
    }


    const addBookSeries = (bookSeriesData) => {
        return axios
            .post("api/books/series", bookSeriesData)
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
                addBookSeries(values)
                    .then(res => {
                        if (res.success === true) {
                            dispatch(getAllBooks());
                            setShow(false);
                            form.resetFields();
                            notification['success']({
                                message: 'Sucess',
                                description: "Book Series Succesfully added.",
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
            Add Series
        </Button>
        <Modal title={'Add Book Series'} visible={show} onCancel={onClose} onOk={onSubmit}>
            <Form
                layout="horizontal"
                form={form}
            >
                <Form.Item label="Book Series" name="bookSeries"
                    rules={[{ required: true, message: "Please enter the name of the Book Series!" }]}>
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </div>)
}

export default AddBookSeries;
