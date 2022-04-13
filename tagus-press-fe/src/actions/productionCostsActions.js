import axios from "axios";

import {
    GET_ALL_PRODUCTION_COSTS,
    PRODUCTION_COSTS_LOADING,
    CLEAR_CURRENT_PRODUCTION_COSTS,
} from "./types";

export const getAllProductionCosts = () => dispatch => {
    dispatch(setProductionCostsLoading());
    axios
        .get("api/production-costs")
        .then(res =>
            dispatch({
                type: GET_ALL_PRODUCTION_COSTS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ALL_PRODUCTION_COSTS,
                payload: {}
            })
        );
};

// Production Costs loading
export const setProductionCostsLoading = () => {
    return {
        type: PRODUCTION_COSTS_LOADING
    };
};

export const clearCurrentProductionCosts = () => {
    return {
        type: CLEAR_CURRENT_PRODUCTION_COSTS
    };
};
