import {
  GET_ALL_SALES,
  SALES_LOADING,
  CLEAR_CURRENT_SALES
} from "../actions/types";

const inititalState = {
  sales: [],
  loading: false
};

export default function(state = inititalState, action) {
  switch (action.type) {
    case SALES_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ALL_SALES:
      return {
        ...state,
        sales: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_SALES:
      return {
        ...state,
        sales: []
      };
    default:
      return state;
  }
}
