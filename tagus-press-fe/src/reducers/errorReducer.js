import { GET_ERRORS } from "../actions/types";

const inititalState = {};

export default function(state = inititalState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
