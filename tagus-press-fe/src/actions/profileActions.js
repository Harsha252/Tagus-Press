import axios from "axios";

import {
  GET_USER_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  
} from "./types";

// Get User's profile
export const getUserProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/users/profile")
    .then(res =>
      dispatch({
        type: GET_USER_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      //TODO Check if error should be dipatched with GET_ERRORS type
      dispatch({
        type: GET_USER_PROFILE,
        payload: {}
      })
    );
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
