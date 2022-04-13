import {
    GET_ALL_PRODUCTION_COSTS,
    PRODUCTION_COSTS_LOADING,
    CLEAR_CURRENT_PRODUCTION_COSTS,
} from "../actions/types";

const initialState = {
    productionCosts: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case PRODUCTION_COSTS_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_ALL_PRODUCTION_COSTS:
            return {
                ...state,
                productionCosts: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PRODUCTION_COSTS:
            return {
                ...state,
                productionCosts: []
            };

        default:
            return state;
    }
}
