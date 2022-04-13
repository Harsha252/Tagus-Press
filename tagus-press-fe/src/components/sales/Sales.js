import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import Papa from "papaparse";
import saveAs from "../../utils/save-as";

import {Button, Row, Col, Input, Select, DatePicker, notification} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';


import { getAllSales } from "../../actions/salesActions";
import { getAllBooks } from "../../actions/booksActions";

import Spinner from "../common/Spinner";
import SalesTable from "./SalesTable";
import AddSale from "./AddSale";

import moment from 'moment';
import _ from 'lodash';

const {Option} = Select;
const {RangePicker} = DatePicker;
const ButtonGroup = Button.Group;

class Sales extends Component {

  constructor() {
    super();
    this.state = {
      search: "",
      location: "All Locations",
      startDate: "",
      endDate: "",
      exporting: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.getAllSales();
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

  onDateChange = (dates) => {
    if (dates) {
      this.setState({ startDate: dates[0] })
      this.setState({ endDate: dates[1] })
    }
  }

  onSelectChange = (name, value) => {
    this.setState({ [name]: value });
  }

  exportData = (filteredSales) => {
    this.setState({ exporting: true })
    let downloadSales = filteredSales.map(s => {
      return {
        "Book": s.book,
        "Location": s.location,
        "Sale Date": s.sale_date,
        "Price Per Unit": s.amount,
        "Quantity": s.quantity,
        "Total Amount": s.total_amount
      }
    })
    let csv = Papa.unparse(downloadSales, {
      delimiter: ",",
      header: true,
      newline: "\r\n"
    });

    let csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(csvData);
    let fileName = "Sales List.csv";
    saveAs(url, fileName);
    notification.success({
      message: "File downloaded",
      description: "Please open the file downloaded",
      placement: "topRight"
    });
    this.setState({ exporting: false });
  }

  render() {
    const { sales, books } = this.props;
    const { search, location, startDate, endDate, exporting } = this.state;
    const { errors } = this.state;
    let filteredSales = (sales.sales || []).filter((sale) => {
      let bookSearch = sale.book.toLowerCase().indexOf(search.toLowerCase()) !== -1
      let locationSearch = true;
      if (location !== "All Locations") {
        locationSearch = (sale.location === location)
      }
      let startSearch = true;
      let start = _.get(startDate, '_d', 'Invalid Date');
      if (start !== "Invalid Date") {
        startSearch = (moment(sale.sale_date).format("YYYY-MM-DD") >= moment(start, "MM/DD/YYYY").format("YYYY-MM-DD"));
      }
      let endSearch = true;
      let end = _.get(endDate, '_d', 'Invalid Date');
      if (end !== "Invalid Date") {
        endSearch = (moment(sale.sale_date).format("YYYY-MM-DD") <= moment(end, "MM/DD/YYYY").format("YYYY-MM-DD") );
      }
      let dateSearch = (startSearch && endSearch);
      return bookSearch && locationSearch && dateSearch;
    });
    let salesContent;
    if (sales.loading) {
      salesContent = <Spinner />;
    } else {
      salesContent = (
        <div>
          <Container>
            <Row className="pt-2 pb-0 mb-4">
              <Col>
                <h2 className="text-dark">
                  Sales
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
                    // error={errors.search}
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
                  <Col>
                    <RangePicker
                      startDate={this.state.startDate}
                      startDateId="your_unique_start_date_id"
                      endDate={this.state.endDate}
                      endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                      onChange={this.onDateChange}
                      focusedInput={this.state.focusedInput}
                      isOutsideRange={() => false}
                      onFocusChange={focusedInput => this.setState({ focusedInput })}
                    >
                    </RangePicker>
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
                      disabled={filteredSales.length === 0}
                      onClick={() => this.exportData(filteredSales)}>
                      Export
                    </Button>
                  </Col>
                  <Col>
                    <AddSale books={books.books} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <SalesTable sales={filteredSales} />
          </Container>
        </div>
      );
    }
    return (
      <div className="sales">{salesContent}</div>
    );
  }
}

Sales.propTypes = {
  auth: PropTypes.object.isRequired,
  sales: PropTypes.object.isRequired,
  getAllSales: PropTypes.func.isRequired,
  getAllBooks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  sales: state.sales,
  books: state.books,
  auth: state.auth
});
export default connect(mapStateToProps, { getAllSales, getAllBooks })(
  Sales
);
