
import { combineReducers } from 'redux';


const initialState = {
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  user: userReducer,
  
});

export default rootReducer;
