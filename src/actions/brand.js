import * as Types from '../constants/BrandTypes';
import callApi from "../utils/apiCaller";

export const actFetchBrandReq = () => {
    return async (dispatch) => {
        return await callApi('brand', 'GET', null, null).then(res => {
            if(res!=null)
            dispatch(actFetchBrand(res.data));
        });
    }
}

export const actFetchBrand = (brands) => {
    return {
        type: Types.FETCH_BRAND,
        brands
    }
}