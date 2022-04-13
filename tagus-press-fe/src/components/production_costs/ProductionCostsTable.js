import React, { Component } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

import ProductionCostsModal from "./ProductionCostsModal"

class ProductionCostsTable extends Component {
    render() {
        const { productionCosts } = this.props;
        let table;
        table = productionCosts.map((productionCostsObj, i) => {
            return (
                <tr>
                    <td className="text-center">{productionCostsObj.name}</td>
                    <td className="text-center">
                        {productionCostsObj.author_name}
                    </td>
                    <td className="text-center">${productionCostsObj.totalCost}</td>
                    <td className="text-center">
                        <ProductionCostsModal productionCosts={productionCostsObj}/>
                    </td>
                </tr>
            );
        });
        return (
            <div>
                <Row className="pt-2 pb-0 mt-4 mb-0">
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th className="text-center">Book</th>
                                <th className="text-center">Author</th>
                                <th className="text-center">Total Production Costs</th>
                                <th className="text-center">More Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table}
                        </tbody>
                    </Table>
                </Row>
            </div>

        );
    }
}

export default ProductionCostsTable;
