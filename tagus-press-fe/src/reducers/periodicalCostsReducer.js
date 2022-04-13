import {
    GET_ALL_PERIODICAL_COSTS,
    PERIODICAL_COSTS_LOADING,
    CLEAR_CURRENT_PERIODICAL_COSTS,
} from "../actions/types";

const initialState = {
    periodicalCosts: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case PERIODICAL_COSTS_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_ALL_PERIODICAL_COSTS:
            return {
                ...state,
                periodicalCosts: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PERIODICAL_COSTS:
            return {
                ...state,
                periodicalCosts: []
            };

        default:
            return state;
    }
}
