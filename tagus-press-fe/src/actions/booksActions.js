import axios from "axios";

import {
    GET_ALL_BOOKS,
    GET_ALL_BOOK_SERIES,
    CLEAR_CURRENT_BOOKS,
    GET_BOOKS_LOADING,
    GET_BOOK_SERIES_LOADING
} from "./types";

// Get list of all books
export const getAllBooks = () => dispatch => {
    dispatch(setBooksLoading());
    axios
        .get("api/books")
        .then(res =>
            dispatch({
                type: GET_ALL_BOOKS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ALL_BOOKS,
                payload: {}
            })
        );
};

// Get list of all book series
export const getAllBookSeries = () => dispatch => {
    dispatch(setBookSeriesLoading());
    axios
        .get("api/books/series")
        .then(res =>
            dispatch({
                type: GET_ALL_BOOK_SERIES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ALL_BOOK_SERIES,
                payload: {}
            })
        );
};

// Books loading
export const setBooksLoading = () => {
    return {
        type: GET_BOOKS_LOADING
    };
};

// Book Series loading
export const setBookSeriesLoading = () => {
    return {
        type: GET_BOOK_SERIES_LOADING
    };
};

export const clearCurrentBooks = () => {
    return {
        type: CLEAR_CURRENT_BOOKS
    };
};
