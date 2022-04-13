import React, { Component, useEffect, useState } from "react";
import { Modal, Button, Form, Select, Input, notification } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import axios from "axios";

// import "./main.scss"; // webpack must be configured to do this
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks, getAllBookSeries } from "../../actions/booksActions";

const { Option } = Select;

const AddBook = (props) => {
    const dispatch = useDispatch();
    const { series } = useSelector(redux => redux.books)
    const [form] = Form.useForm();
    const [show, setShow] = useState(false);

    const onShow = () => {
        setShow(true)

    }
    const onClose = () => {
        setShow(false)
    }

    let seriesList = (series).map(s => {
        let result = {};
        result.name = s.name;
        result.label = s.name;
        result.value = s.id;
        return result;
    });

    seriesList.unshift({
        name: 'No Series',
        label: 'No Series',
        value: null
    })


    const addBook = (bookData) => {
        return axios
            .post("api/books", bookData)
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
                addBook(values)
                    .then(res => {
                        if (res.success === true) {
                            dispatch(getAllBooks());
                            dispatch(getAllBookSeries());
                            setShow(false);
                            form.resetFields();
                            notification['success']({
                                message: 'Sucess',
                                description: "Book Succesfully added.",
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
            Add Book
        </Button>
        <Modal title={'Add Book'} visible={show} onCancel={onClose} onOk={onSubmit}>
            <Form
                layout="horizontal"
                form={form}
            >
                <Form.Item label="Select Series" name="seriesId"
                    rules={[{ required: false, message: "Please select a Book Series!" }]}>
                    <Select showSearch placeholder="Select Book Series" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                        {seriesList.map(s => {
                            return < Option key={s.label} value={s.value}>{s.label}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Book" name="book"
                    rules={[{ required: true, message: "Please enter the name of the Book!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Author" name="author"
                    rules={[{ message: "Please enter the author of the Book!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="ISBN" name="isbn"
                    rules={[{ message: "Please enter the ISBN of the Book!" }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    </div>)
}

export default AddBook;
