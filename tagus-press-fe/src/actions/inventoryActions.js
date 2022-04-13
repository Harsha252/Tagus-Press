import axios from "axios";

import {
  GET_ALL_INVENTORY,
  INVENTORY_LOADING,
  CLEAR_CURRENT_INVENTORY,
} from "./types";

export const getAllInventory = () => dispatch => {
  dispatch(setInventoryLoading());
  axios
    .get("api/inventory")
    .then(res =>
      dispatch({
        type: GET_ALL_INVENTORY,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ALL_INVENTORY,
        payload: {}
      })
    );
};

// Inventory loading
export const setInventoryLoading = () => {
  return {
    type: INVENTORY_LOADING
  };
};

export const clearCurrentInventory = () => {
  return {
    type: CLEAR_CURRENT_INVENTORY
  };
};
