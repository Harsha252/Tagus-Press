import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Papa from "papaparse";
import saveAs from "../../utils/save-as";

import { Container } from "react-bootstrap";
import { Row, Col, Input, notification, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { getAllPeriodicalCosts } from "../../actions/periodicalCostsActions";
import Spinner from "../common/Spinner";
import PeriodicalCostsTable from "./PeriodicalCostsTable";
import AddPeriodicalCosts from "./AddPeriodicalCosts";
import { getAllBooks } from "../../actions/booksActions";


class PeriodicalCosts extends Component {

  constructor() {
    super();
    this.state = {
      search: "",
      exporting: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.getAllPeriodicalCosts();
      this.props.getAllBooks();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => {
    this.setState({ search: e.target.value });
  }

  exportData = (filteredPeriodicalCosts) => {
    this.setState({ exporting: true })
    let downloadPeriodicalCosts = filteredPeriodicalCosts.map(cost => {
      return {
        "Book": cost.name,
        "First Edition": cost.first_edition,
        "Published Price": cost.published,
        "Author/Translator/Literary Agency": cost.author_translator_literary
      }
    })
    let csv = Papa.unparse(downloadPeriodicalCosts, {
      delimiter: ",",
      header: true,
      newline: "\r\n"
    });

    let csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(csvData);
    let fileName = "Periodical Costs.csv";
    saveAs(url, fileName);
    notification.success({
      message: "File downloaded",
      description: "Please open the file downloaded",
      placement: "topRight"
    });
    this.setState({ exporting: false });
  }

  render() {
    const { search, exporting } = this.state;
    const { periodicalCosts, books } = this.props;
    let filteredPeriodicalCosts = (periodicalCosts.periodicalCosts || []).filter((periodical) => {
      return (periodical.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    });
    const { errors } = this.state;
    let periodicalCostsContent;

    if (periodicalCosts.loading) {
      periodicalCostsContent = <Spinner />;
    } else {
      periodicalCostsContent = (
        <div>
          <Container>
            <Row className="pt-2 pb-0 mb-4">
              <Col>
                <h2 className="text-dark">
                  Periodical Costs
                            </h2>
              </Col>
            </Row>
            <Row
              justify="space-between"
              className="mb-4"
            >
              <Col>
                <Input
                  placeholder="Search by Book"
                  name="search"
                  type="text"
                  style={{ width: 400 }}
                  value={this.state.search}
                  onChange={this.onChange}
                />
              </Col>
              <Col>
                <Row gutter={4}>
                  <Col>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      shape="round"
                      loading={exporting}
                      disabled={filteredPeriodicalCosts.length === 0}
                      onClick={() => this.exportData(filteredPeriodicalCosts)}>
                      Export
                                     </Button>
                  </Col>
                  <Col>
                    <AddPeriodicalCosts books={books.books} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <PeriodicalCostsTable periodicalCosts={filteredPeriodicalCosts} />
          </Container>
        </div>
      );
    }



    return <div className="dashboard">{periodicalCostsContent}</div>;
  }
}

PeriodicalCosts.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  periodicalCosts: PropTypes.object.isRequired,
  getAllPeriodicalCosts: PropTypes.func.isRequired,
  getAllBooks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  periodicalCosts: state.periodicalCosts,
  books: state.books,
  auth: state.auth,
  search: state.search
});

export default connect(mapStateToProps, {
  getAllPeriodicalCosts, getAllBooks
})(PeriodicalCosts);
