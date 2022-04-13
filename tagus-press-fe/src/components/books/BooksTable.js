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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input required={false}/>;
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
              required: dataIndex === "name" ? true : false,
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


const BooksTable = (props) => {

  const { books } = props;
  const booksTable = books.map(book => {
    return {
      key: book.id,
      name: book.name,
      author: book.author || "-",
      isbn: book.isbn || "-",
      series: book.series || "-"
    }
  })

  const [form] = Form.useForm();
  const [data, setData] = useState(booksTable);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      author: '',
      isbn: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const updateBook = (bookData) => {
    return axios
      .post("api/books/modify", bookData)
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
        updateBook(editedRowData).then(res => {
          if (res.success === true) {
            newData.splice(index, 1, editedRowData);
            setData(newData);
            setEditingKey('');
            notification['success']({
              message: 'Sucess',
              description: "Book Succesfully Updated.",
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
      dataIndex: 'name',
      key: 'name',
      editable: true
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      editable: true
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      editable: true
    },
    {
      title: 'Series',
      dataIndex: 'series',
      key: 'series'
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
        inputType: 'text',
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

export default BooksTable;
