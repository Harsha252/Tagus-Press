import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Form } from "react-bootstrap";
import Papa from "papaparse";
import saveAs from "../../utils/save-as";

import { Button, Row, Col, Input, Select, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import InventoryTable from "./InventoryTable";
import AddInventory from "./AddInventory";
import Spinner from "../common/Spinner";

import { getAllInventory } from "../../actions/inventoryActions";
import { getAllBooks } from "../../actions/booksActions";

const { Option } = Select;

class Inventory extends Component {

  constructor() {
    super();
    this.state = {
      search: "",
      location: "All Locations",
      exporting: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.getAllInventory();
      this.props.getAllBooks();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  onSelectChange = (name, value) => {
    this.setState({ [name]: value });
  }

  exportData = (filteredInventory) => {
    this.setState({ exporting: true })
    let downlodInventory = filteredInventory.map(inventory => {
      return {
        "Book": inventory.book,
        "Author": inventory.author,
        "Location": inventory.location,
        "Inventory": inventory.count
      }
    })
    let csv = Papa.unparse(downlodInventory, {
      delimiter: ",",
      header: true,
      newline: "\r\n"
    });

    let csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(csvData);
    let fileName = "Inventory List.csv";
    saveAs(url, fileName);
    notification.success({
      message: "File downloaded",
      description: "Please open the file downloaded",
      placement: "topRight"
    });
    this.setState({ exporting: false });
  }

  render() {
    const { inventory, books } = this.props;
    const { search, location, exporting } = this.state;
    const { errors } = this.state;
    let filteredInventory = (inventory.inventory || []).filter((book) => {
      let bookSearch = book.book.toLowerCase().indexOf(search.toLowerCase()) !== -1
      let locationSearch = true;
      if (location !== "All Locations") {
        locationSearch = (book.location === location)
      }
      return bookSearch && locationSearch;
    });
    let inventoryContent;
    if (inventory.loading) {
      inventoryContent = <Spinner />;
    } else {
      inventoryContent = (
        <div>
          <Container>
            <Row className="pt-2 pb-0 mb-4">
              <Col>
                <h2 className="text-dark">
                  Inventory
                </h2>
              </Col>
            </Row>

            <Row
              justify="space-between"
              className="mb-4"
            >
              <Col>
                <Row gutter={4}>
                  <Col>
                    <Input
                      placeholder="Search by Book"
                      name="search"
                      type="text"
                      value={this.state.search}
                      onChange={this.onChange}
                    />
                  </Col>
                  <Col>
                    <Select
                      value={this.state.location}
                      onChange={(value) => this.onSelectChange("location", value)}
                    >
                      <Option value="All Locations">All Locations</Option>
                      <Option value="Main Center">Main Center</Option>
                      <Option value="UMassD">UMassD</Option>
                    </Select>
                  </Col>
                </Row>  
              </Col>

              <Col>
                <Row gutter={4}>
                  <Col>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      shape="round"
                      loading={exporting}
                      disabled={filteredInventory.length === 0}
                      onClick={() => this.exportData(filteredInventory)}>
                      Export
                    </Button>
                  </Col>
                  <Col>
                    <AddInventory books={books.books} />
                  </Col>
                </Row>
                
              </Col>
            </Row>
            <InventoryTable inventory={filteredInventory}/>
          </Container>
        </div>
      );
    }
    return (
      <div className="inventory">{inventoryContent}</div>
    );
  }
}

Inventory.propTypes = {
  auth: PropTypes.object.isRequired,
  inventory: PropTypes.object.isRequired,
  books: PropTypes.object.isRequired,
  getAllInventory: PropTypes.func.isRequired,
  getAllBooks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  inventory: state.inventory,
  books: state.books,
  auth: state.auth
});

export default connect(mapStateToProps, { getAllInventory, getAllBooks })(
  Inventory
);
