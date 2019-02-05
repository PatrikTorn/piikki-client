import { createActionPointers } from '../tools/actionTools';
import axios from 'axios';
// https://212.24.109.198:8000/piikkitest'
const ENDPOINT = 'https://indecs.fi/piikki-admin/api.php';
export const types = createActionPointers([
    `SET_STATE`,
    'GET_DATA',
    'LOGIN',
    'GET_PRODUCTS',
    'GET_USERS',
    'SET_ADMIN'
]);

export const setState = (payload) => ({
    type: types.SET_STATE.NAME,
    payload
});

export const setAdmin = (user) => ({
    type: types.SET_ADMIN.NAME,
    payload: axios.put(`${ENDPOINT}/users/${user.id}`, JSON.stringify({ is_admin: user.is_admin ? 0 : 1 }))
});

export const getData = ({ end, start }) => async dispatch => {
    try {
        dispatch({ type: types.GET_DATA.PENDING });
        const pRes = await fetch(`${ENDPOINT}/purchases?start=${start}&end=${end}`);
        const purchases = await pRes.json();
        const dRes = await fetch(`${ENDPOINT}/deposits?start=${start}&end=${end}`);
        const deposits = await dRes.json();
        dispatch({
            type: types.GET_DATA.FULFILLED,
            payload: { deposits, purchases }
        });
    } catch (e) {
        dispatch({ type: types.GET_DATA.REJECTED })
    }
}


export const getUsers = () => ({
    type: types.GET_USERS.NAME,
    payload: axios.get(`${ENDPOINT}/users`)
});

export const getProducts = () => ({
    type: types.GET_PRODUCTS.NAME,
    payload: async () => { const res = await fetch(`${ENDPOINT}/products`); return await res.json() }
})

export const login = ({ name, password }) => ({
    type: types.LOGIN.NAME,
    //    payload: axios.post(`${ENDPOINT}/login`, JSON.stringify({name, password}))
    payload: new Promise((resolve, reject) => {
        if(false) { // no password here
            resolve(name);
        }else {
            reject();
        }
    })
});

export const logout = () => dispatch => {
    localStorage.removeItem('name');
    localStorage.removeItem('password');
    dispatch(setState({ user: null }));
}
