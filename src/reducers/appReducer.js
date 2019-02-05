import {types} from "../actions/appActions";
import moment from 'moment';
let initialState = {
    loading:true,
    purchases:[],
    deposits:[],
    products:{},
    users:[],
    total:0,
    start:moment(new Date()).add(-7,'days').format('YYYY-MM-DD'),
    screen:1,
    end:moment(new Date()).add(1,'days').format('YYYY-MM-DD'),
    user:null
};

const appReducer = (state = initialState, {payload, type}) => {
// defaultChecker(action, types, state);

  switch (type) {
    case types.SET_STATE.NAME:
      return {...state, ...payload}
    case types.GET_DATA.PENDING:
    case types.GET_USERS.PENDING:
    case types.SET_ADMIN.PENDING:
    case types.LOGIN.PENDING:
        return {...state, loading:true}
    case types.GET_DATA.REJECTED:
    case types.GET_USERS.REJECTED:
    case types.SET_ADMIN.REJECTED:
    case types.LOGIN.REJECTED:
        return {...state, loading:false}
    case types.GET_DATA.FULFILLED: 
        return {...state, purchases:payload.purchases, deposits:payload.deposits, loading:false}
    case types.LOGIN.FULFILLED:
        return {...state, user:payload, loading:false}
    case types.GET_USERS.FULFILLED:
        return {...state, users:payload.data}
    case types.SET_ADMIN.FULFILLED:
        return {...state, users:state.users.map(u => u.id === payload.data ? {...u, is_admin:!u.is_admin} : u), loading:false}
    case types.GET_PRODUCTS.FULFILLED:
        return {...state, products:payload.reduce((acc, obj) => ({...acc, [obj.id]:obj}), {})};
    default:
      return state;
    }
};

export default appReducer
