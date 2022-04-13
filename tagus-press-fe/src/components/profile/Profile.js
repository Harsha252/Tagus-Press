import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";  
import { Button, Row, Col, Input, notification, Form } from 'antd';

import UpdatePassword from "./UpdatePassword";

import AddUser from "./AddUser";

class Profile extends Component {

  constructor() {
    super();
    this.state = {
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
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

    const { auth } = this.props;
    const user = auth.user;

    console.log(auth);

    let profileContent;

    profileContent = (
      <div>
        <Container>
          <Row 
            justify="space-between"
            className="pt-2 pb-0 mb-4">
            <Col>
              <h2 className="text-dark">
                Profile
              </h2>
            </Col>
            <Col>
              <Row gutter={4}>
                <Col>
                  {user.is_admin ? <AddUser/> : null}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <UpdatePassword />
          </Row>
        </Container>
      </div>
    )

    return <div>{profileContent}  </div>
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);