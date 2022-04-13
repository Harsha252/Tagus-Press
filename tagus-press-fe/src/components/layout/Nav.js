import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navbar, Container, Row, Col } from "react-bootstrap";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";
import { clearCurrentBooks } from "../../actions/booksActions";
import { clearCurrentInventory } from "../../actions/inventoryActions";
import { clearCurrentSales } from "../../actions/salesActions";
import { clearCurrentProductionCosts } from "../../actions/productionCostsActions";

class Nav extends Component {
  //TODO Clear any new states in future, example profile
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.clearCurrentBooks();
    this.props.clearCurrentProfile();
    this.props.clearCurrentInventory();
    this.props.clearCurrentSales();
    this.props.clearCurrentProductionCosts();

  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            {" "}
            Profile
            {" "}
          </Link>
        </li>
        <li className="nav-item">
          <a
            href="#"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            {/* <img
              className="avatar"
              src={`https://ui-avatars.com/api/?Satish+Mouli`}
              style={{ width: "25px", marginRight: "5px" }}
            /> */}
            {/* <i
              class="far fa-user-circle"
              style={{ marginRight: "5px", size: "9x" }}
            ></i> */}
            Logout
          </a>
        </li>
      </ul>
    );

    const userLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/books">
            {" "}
            Books
            {" "}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/inventory">
            {" "}
            Inventory
            {" "}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/sales">
            {" "}
            Sales
            {" "}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/production-costs">
            {" "}
            Production Costs
            {"  "}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/periodical-costs">
            {" "}
            Periodical Costs
            {"  "}
          </Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );
    return (
      // TODO Change Sticky top if needed
      <Navbar className="navbar-expand-sm navbar-dark bg-dark mb-4 sticky-top-nav">
        <Container>
          <Navbar.Brand href="/">Tagus Press</Navbar.Brand>
          <Navbar.Toggle
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="mobile-nav">
            {isAuthenticated ? userLinks : null}
            {isAuthenticated ? authLinks : guestLinks}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  clearCurrentProfile: PropTypes.func.isRequired,
  clearCurrentBooks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  logoutUser,
  clearCurrentProfile,
  clearCurrentBooks,
  clearCurrentInventory,
  clearCurrentSales,
  clearCurrentProductionCosts
})(Nav);
