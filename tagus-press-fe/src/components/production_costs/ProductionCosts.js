import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";

import { Row as AntRow, Col as AntCol, Input } from 'antd';
import TextFieldGroup from "../common/TextFieldGroup";


import { getAllProductionCosts } from "../../actions/productionCostsActions";
import Spinner from "../common/Spinner";
import ProductionCostsTable from "./ProductionCostsTable";

class ProductionCosts extends Component {

    constructor() {
        super();
        this.state = {
            search: "",
            errors: {}
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.getAllProductionCosts();
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

    render() {
        const { search } = this.state;
        const { productionCosts } = this.props;
        let filteredProductionCosts = (productionCosts.productionCosts || []).filter((productionCost) => {
            return (productionCost.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        });
        const { errors } = this.state;
        let productionCostsContent;

        if (productionCosts.loading) {
            productionCostsContent = <Spinner />;
        }

        productionCostsContent = (
            <div>
                <Container>
                    <Row className="pt-2 pb-0 mb-4">
                        <Col className="col-lg-6 col-md-4 col-8">
                            <h2 className="text-dark">
                                Production Costs
                            </h2>
                        </Col>
                    </Row>
                    <AntRow
                        align="middle"
                        gutter={8}
                    >
                        <AntCol>
                            <Input
                                placeholder="Search by Book"
                                name="search"
                                type="text"
                                size="large"
                                style={{ width: 400 }}
                                value={this.state.search}
                                onChange={this.onChange}
                            // error={errors.search}
                            />
                        </AntCol>
                    </AntRow>
                    
                    <ProductionCostsTable productionCosts={filteredProductionCosts} />
                </Container>
            </div>
        );

        return <div className="dashboard">{productionCostsContent}</div>;
    }
}

ProductionCosts.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    productionCosts: PropTypes.object.isRequired,
    getAllProductionCosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    productionCosts: state.productionCosts,
    auth: state.auth,
    search: state.search
});

export default connect(mapStateToProps, {
    getAllProductionCosts
})(ProductionCosts);
