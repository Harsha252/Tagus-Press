import {
  GET_ALL_INVENTORY,
  INVENTORY_LOADING,
  CLEAR_CURRENT_INVENTORY,
} from "../actions/types";

const initialState = {
  inventory: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case INVENTORY_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ALL_INVENTORY:
      return {
        ...state,
        inventory: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_INVENTORY:
      return {
        ...state,
        inventory: []
      };

    default:
      return state;
  }
}
