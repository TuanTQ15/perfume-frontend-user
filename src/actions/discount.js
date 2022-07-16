import * as Types from '../constants/DiscountTypes';
import callApi from "../utils/apiCaller";

export const actFetchDiscountReq = () => {
    return async (dispatch) => {
        return await callApi('discount', 'GET', null, null).then(res => {
            if(res!=null) dispatch(actFetchDiscount(res.data));
        });
    }
}

export const actFetchDiscount = (discounts) => {
    return {
        type: Types.FETCH_DISCOUNT,
        discounts
    }
}