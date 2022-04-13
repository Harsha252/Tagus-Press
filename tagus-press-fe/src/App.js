import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import { clearCurrentBooks } from "./actions/booksActions";
import { clearCurrentInventory } from "./actions/inventoryActions";
import { clearCurrentSales } from "./actions/salesActions";
import { clearCurrentProductionCosts } from "./actions/productionCostsActions";
import { clearCurrentPeriodicalCosts } from "./actions/periodicalCostsActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Nav from "./components/layout/Nav";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Books from "./components/books/Books";
import Inventory from "./components/inventory/Inventory";
import Sales from "./components/sales/Sales";
import ProductionCosts from "./components/production_costs/ProductionCosts";
import PeriodicalCosts from "./components/periodical_costs/PeriodicalCosts";
import Profile from "./components/profile/Profile";

import 'antd/dist/antd.css'
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-dates/lib/css/_datepicker.css';
import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Books
    store.dispatch(clearCurrentBooks());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Clear current Inventory
    store.dispatch(clearCurrentInventory());
    // Clear current Sales
    store.dispatch(clearCurrentSales());
    // Clear current Production Costs
    store.dispatch(clearCurrentProductionCosts());
    // Clear current Periodical Costs
    store.dispatch(clearCurrentPeriodicalCosts());
    //TODO Clear any new states in future, example profile

    // TODO Redirect to login
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Nav />
          <Route exact path="/" component={Landing}></Route>
          <Route exact path="/login" component={Login}></Route>
          <div className="container custom-content">
            <Switch>
              <PrivateRoute
                exact
                path="/books"
                component={Books}
              ></PrivateRoute>
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/inventory"
                component={Inventory}
              ></PrivateRoute>
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/sales"
                component={Sales}
              ></PrivateRoute>
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/production-costs"
                component={ProductionCosts}
              ></PrivateRoute>
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/periodical-costs"
                component={PeriodicalCosts}
              ></PrivateRoute>
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/profile"
                component={Profile}
              ></PrivateRoute>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
