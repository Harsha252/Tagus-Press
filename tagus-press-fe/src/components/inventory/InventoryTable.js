import React, { useState } from "react";
import { Table, Input, InputNumber, Form, Popconfirm, Button, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";

import axios from "axios";

// import "./main.scss"; // webpack must be configured to do this
import "../../App.css";

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

const InventoryTable = (props) => {
  const { inventory } = props;

  const inventoryTable = inventory.map(book => {
    return {
      key: book.id,
      book: book.book,
      author: book.author,
      location: book.location,
      count: book.count
    }
  })

  const [form] = Form.useForm();
  const [data, setData] = useState(inventoryTable);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      count: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const updateInventory = (inventoryData) => {
    return axios
      .post("api/inventory/modify", inventoryData)
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
        updateInventory(editedRowData).then(res => {
          if (res.success === true) {
            newData.splice(index, 1, editedRowData);
            setData(newData);
            setEditingKey('');
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
      title: 'Author',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Inventory',
      dataIndex: 'count',
      key: 'count',
      width: 128,
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
            <Button icon={<EditOutlined />} type="link" disabled={editingKey !== ''} onClick={() => edit(record)}/>
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
export default InventoryTable;
