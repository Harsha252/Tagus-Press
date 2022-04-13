import axios from "axios";

import {
  GET_ALL_SALES,
  SALES_LOADING,
  CLEAR_CURRENT_SALES
} from "./types";

// Get all Sales
export const getAllSales = () => dispatch => {
  dispatch(setSalesLoading());
  axios
    .get("api/sales")
    .then(res =>
      dispatch({
        type: GET_ALL_SALES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ALL_SALES,
        payload: []
      })
    );
};

// Sales loading
export const setSalesLoading = () => {
  return {
    type: SALES_LOADING
  };
};

export const clearCurrentSales = () => {
  return {
    type: CLEAR_CURRENT_SALES
  };
};
