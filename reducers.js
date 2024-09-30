import { combineReducers } from 'redux';

// Example of a simple reducer for user state
const userReducer = (state = { user: null }, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        default:
            return state;
    }
};

// Combine reducers (in case you have more than one reducer)
const rootReducer = combineReducers({
    user: userReducer, // Add more reducers if needed
});

export default rootReducer;
