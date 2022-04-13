import {
    GET_ALL_BOOKS,
    GET_ALL_BOOK_SERIES,
    CLEAR_CURRENT_BOOKS,
    GET_BOOKS_LOADING,
    GET_BOOK_SERIES_LOADING
} from "../actions/types";

const initialState = {
    books: [],
    series: [],
    loading: false,
    seriesLoading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BOOKS_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_BOOK_SERIES_LOADING:
            return {
                ...state,
                seriesLoading: true
            };
        case GET_ALL_BOOKS:
            return {
                ...state,
                books: action.payload,
                loading: false
            };
        case GET_ALL_BOOK_SERIES:
            return {
                ...state,
                series: action.payload,
                seriesLoading: false
            };
        case CLEAR_CURRENT_BOOKS:
            return {
                ...state,
                books: [],
                series: []
            };

        default:
            return state;
    }
}
