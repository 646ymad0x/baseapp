import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { userOffersData, userOffersError, UserOffersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* userOffersSaga(action: UserOffersFetch) {
    try {
        const { data, headers } = yield call(API.get(config), `/private/offers?${buildQueryString(action.payload)}`);

        yield put(userOffersData({ list: data, total: headers.total, page: action.payload.page }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userOffersError,
            },
        }));
    }
}
