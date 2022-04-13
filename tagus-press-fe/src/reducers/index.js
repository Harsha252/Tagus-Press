import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import inventoryReducer from "./inventoryReducer";
import salesReducer from "./salesReducer";
import booksReducer from "./booksReducer";
import productionCostsReducer from "./productionCostsReducer";
import periodicalCostsReducer from "./periodicalCostsReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  inventory: inventoryReducer,
  sales: salesReducer,
  books: booksReducer,
  productionCosts: productionCostsReducer,
  periodicalCosts: periodicalCostsReducer,
});
