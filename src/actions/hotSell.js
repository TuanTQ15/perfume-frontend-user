import * as Types from '../constants/HotSellTypes';
import callApi from "../utils/apiCaller";

export const actFetchHotSellReq = () => {
    return (dispatch) => {
        return callApi('hotsell', 'GET', null, null).then(res => {
            if(res!=null) dispatch(actFetchHotSell(res.data));
        });
    }
}

export const actFetchHotSell = (hotSell) => {
    return {
        type: Types.FETCH_HOT_SELL,
        hotSell
    }
}