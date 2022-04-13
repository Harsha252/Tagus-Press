import React, { Component } from "react";
import { Modal, Row, Col, Table, Button } from "react-bootstrap";
import _ from "lodash";

class ProductionCostsModal extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            errors: {}
        };

        this.onClose = this.onClose.bind(this);
        this.onShow = this.onShow.bind(this);
    }

    onClose = (e) => {
        this.setState({show: false})
    }

    onShow = (e) => {
        this.setState({ show: true })
    }
    
    render() {
        const { productionCosts } = this.props;
        const { show } = this.state;
        const costMap = {
            "translation": "Translation",
            "copy_editing": "Copy Editing",
            "type_setting": "Typesetting",
            "design_production": "Design & Production",
            "cover": "Cover",
            "printing": "Printing",
            "publishing_fees": "Publishing fees",
            "shipping": "Shipping",
            "promotion": "Promotion",
            "events": "Events",
            "mailing": "Mailing",
            "author": "Author rights",
            "image_rights": "Image rights",
            "free_copies_umass": "Free Copies (UMassD)",
            "free_copies_center": "Free Copies (Main Center)",
            "copyright_registration_fee": "Copyright Registration Fee",
            "totalCost": "Total Cost"
        }

        let costsArray = Object.keys(productionCosts).map(key => {
            if (costMap[key]) {
                return {
                    category: costMap[key],
                    cost: productionCosts[key] || "-"
                }
            }
            return null
        })
        costsArray = _.compact(costsArray);
 
        let table = costsArray.map((cost, i) => {
            return (
                <tr>
                    <td className="text-center">{cost.category}</td>
                    <td className="text-center">
                        {cost.cost}
                    </td>
                </tr>
            );
        });

        return (
            <>
            <Button variant="primary" onClick={this.onShow}>
                More
            </Button>
                <Modal show={show} onHide={this.onClose}>
                <Modal.Header closeButton>
                        <Modal.Title>{productionCosts.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th className="text-center">Category</th>
                                <th className="text-center">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
            </>
        );
    }
}

export default ProductionCostsModal;
