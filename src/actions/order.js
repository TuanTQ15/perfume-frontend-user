import * as Types from '../constants/OrderTypes';
import callApi from "../utils/apiCaller";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { actDelAllCartAfterOrder } from "./cart";
import { getKh, getTokenUser } from './getUser';

const MySwal = withReactContent(Swal)



function listCTPD(cart) {
    var list = []
    for (let index = 0; index < cart.length; index++) {
        if (cart[index].product.detailPromotion !== null) {
            let itemCart = {
                productId: cart[index].product.productId,
                quantity: cart[index].quantity,
                price: Math.round(cart[index].product.price * (100 - cart[index].product.detailPromotion.percentDiscount) / 100)
            }
            list.push(itemCart)
        } else {
            let itemCart = {
                productId: cart[index].product.productId,
                quantity: cart[index].quantity,
                price: Math.round(cart[index].product.price)
            }
            list.push(itemCart)
        }
    }
    return list
}

export const actAddOrderReq = (cart, value, history,transactionID) => {
    // let kh = getKh(history)
    // if (kh == null) {
    //     MySwal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: "Vui lòng đăng nhập để đặt hàng"
    //     })
    //     return
    // }
    // console.log(kh)
    let order = {
        fullName: value.name,
        address: value.address,
        phoneNumber: value.phoneNumber,
        bookingDate: new Date(),
        deliveryDate: new Date(value.ngaygiao),
        status: 0,
        note: value.GHICHU,
        transactionId: transactionID,
        // MA_KH: kh.actort,
        detailOrderList: listCTPD(cart)
    }
    console.log(order.transactionID)
    console.log(JSON.stringify(order))
    // `Bearer ${kh.token}`
    return async  (dispatch) => {
        return await callApi('order', 'POST', order, `Bearer ${getTokenUser()}`).then(res => {
            console.log(res)
            if (res.data.result === true) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                localStorage.removeItem('CART')
                history.push('/order')
                dispatch(actDelAllCartAfterOrder())
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
            return res.data
        });
    }
}

export const actFetchOrderReq = (status, history) => {
    var kh = getKh(history)
    if(kh != null){
        return async (dispatch) => {
            return await callApi(`orderUser?status=${status}`, 'GET', null, `Bearer ${getTokenUser()}`).then(res => {
                if(res!=null) dispatch(actFetchOrder(res.data, status));
            });
        }
    }
}

export const actFetchOrder = (orders, status) => {
    if (status === 0) {
        return {
            type: Types.FETCH_ORDER_PENDING,
            orders
        }
    } else if (status === 1) {
        return {
            type: Types.FETCH_ORDER_SHIPPING,
            orders
        }
    }
    else if (status === 2) {
        return {
            type: Types.FETCH_ORDER_SUCCESS,
            orders
        }
    }
    else {
        return {
            type: Types.FETCH_ORDER_CANCEL,
            orders
        }
    }
}

export const actUpdateStatusReq = (itemUpdate, status) => {
    return async (dispatch) => {
        return await callApi(`orderUser`, 'PUT', itemUpdate, `Bearer ${getTokenUser()}`).then(res => {
            if (res.data.result === 1) {
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
               dispatch(actUpdateStatus(itemUpdate, status))
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
        });
    }
}

export const actUpdateStatus = (itemUpdate, status) => {
    return {
        type: Types.UPDATE_STATUS,
        order: itemUpdate,
        status
    }

}

export const actCheckQuantity = (order) => {
    
    return async () => {
        return await callApi(`checkQuantity`, 'POST', order, `Bearer ${getTokenUser()}`).then(res => {
            if(res!=null) return res.data
        });
    }
}