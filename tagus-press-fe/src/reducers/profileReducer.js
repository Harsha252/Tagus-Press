import {
  GET_USER_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
} from "../actions/types";

const initialState = {
  user: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_USER_PROFILE:
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
