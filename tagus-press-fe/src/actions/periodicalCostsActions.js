import axios from "axios";

import {
    GET_ALL_PERIODICAL_COSTS,
    PERIODICAL_COSTS_LOADING,
    CLEAR_CURRENT_PERIODICAL_COSTS,
} from "./types";

export const getAllPeriodicalCosts = () => dispatch => {
    dispatch(setPeriodicalCostsLoading());
    axios
        .get("api/periodical-costs")
        .then(res =>
            dispatch({
                type: GET_ALL_PERIODICAL_COSTS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ALL_PERIODICAL_COSTS,
                payload: {}
            })
        );
};

// Periodical Costs loading
export const setPeriodicalCostsLoading = () => {
    return {
        type: PERIODICAL_COSTS_LOADING
    };
};

export const clearCurrentPeriodicalCosts = () => {
    return {
        type: CLEAR_CURRENT_PERIODICAL_COSTS
    };
};
