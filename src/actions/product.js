import * as Types from '../constants/ProductTypes';
import callApi from "../utils/apiCaller";

export const actFetchProductsRequest = (keyword) => {
    return async (dispatch) => {
        return await callApi('product', 'GET', null, null).then(res => {
            if(res!=null) dispatch(actFetchProducts(res.data, keyword));
        });
    }
}

export const actFetchProducts = (product, keyword) => {
    return {
        type: Types.FETCH_PRODUCTS,
        product,
        keyword
    }
}

export const actFetchProductsByBrandReq = (brandId) => {
    return async (dispatch) => {
        return await callApi(`product/brand?brandId=${brandId}`, 'GET', null, null).then(res => {
            if(res!=null) dispatch(actFetchProductsByBrand(res.data));
        });
    }
}

export const actFetchProductsByBrand = (product, keyword) => {
    return {
        type: Types.FETCH_PRODUCTS_BY_BRAND,
        product
    }
}

export const actFetchNewLineProductReq = () => {
    return async (dispatch) => {
        return await callApi('newProduct', 'GET', null, null).then(res => {
            if(res!=null) dispatch(actFetchNewLineProduct(res.data));
        });
    }
}

export const actFetchNewLineProduct = (newProduct) => {
    return {
        type: Types.FETCH_LINE_PRODUCTS_NEW,
        newProduct
    }
}