import React, { Component, useEffect, useState } from "react";
import { Modal, Button, Form, Select, Input, notification } from "antd";

import { logoutUser } from "../../actions/authActions";

import axios from "axios";

// import "./main.scss"; // webpack must be configured to do this
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";

const UpdatePassword = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector(redux => redux.auth);
  const [form] = Form.useForm();

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const updatePassword = (passwordData) => {
    passwordData.user_id = user.id;
    return axios
      .post("api/users/update-password", passwordData)
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
        updatePassword(values)
          .then(res => {
            if (res.success === true) {
              dispatch(logoutUser());
              form.resetFields();
              notification['success']({
                message: 'Sucess',
                description: "Password Succesfully updated.",
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

  return (
    <div>
      <Form
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 16,
        }}
        layout="horizontal"
        form={form}
        onFinish={onSubmit}
      >
        <Form.Item label="Current Password" name="current_password"
          rules={[{ required: true, message: "Please enter your current password!" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="New Password" name="new_password"
          rules={[{ required: true, message: "Please enter the new Password!" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirm_password"
          dependencies={['new_password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">
            Update Password
        </Button>
        </Form.Item>
      </Form>

    </div>
  )

}

export default UpdatePassword;