import { CommonError } from "src/modules/types";
import { P2POrdersActions } from "./actions";
import {
    P2P_ORDERS_CREATE_DATA,
    P2P_ORDERS_CREATE_ERROR,
    P2P_ORDERS_CREATE_FETCH,
    P2P_TRADES_HISTORY_DATA,
    P2P_TRADES_HISTORY_ERROR,
    P2P_TRADES_HISTORY_FETCH,
} from "./constants";
import { P2POrder, P2PTradesHistory } from "./types";

export interface P2POrdersState {
    createOrder: {
        data: P2POrder;
        loading: boolean;
        success: boolean;
        error?: CommonError;
    };
    tradesHistory: {
        page: number;
        total: number;
        list: P2PTradesHistory[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2POrdersState: P2POrdersState = {
    createOrder: {
        data: null,
        loading: false,
        success: false,
    },
    tradesHistory: {
        page: 0,
        total: 0,
        list: [],
        fetching: false,
        success: false,
    },
};

const createOrderReducer = (state: P2POrdersState['createOrder'], action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_ORDERS_CREATE_FETCH:
            return {
                ...state,
                loading: true,
            };
        case P2P_ORDERS_CREATE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
                success: true,
                error: undefined,
            };
        case P2P_ORDERS_CREATE_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const tradesHistoryReducer = (state: P2POrdersState['tradesHistory'], action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_TRADES_HISTORY_FETCH:
            return {
                ...state,
                fetching: true,
            };
        case P2P_TRADES_HISTORY_DATA:
            return {
                ...state,
                list: action.payload.list,
                page: action.payload.page,
                total: action.payload.total,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_TRADES_HISTORY_ERROR:
            return {
                ...state,
                list: [],
                page: 0,
                total: 0,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pOrdersReducer = (state = initialP2POrdersState, action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_ORDERS_CREATE_FETCH:
        case P2P_ORDERS_CREATE_DATA:
        case P2P_ORDERS_CREATE_ERROR:
            const createOrderState = { ...state.createOrder };

            return {
                ...state,
                createOffer: createOrderReducer(createOrderState, action),
            };
        case P2P_TRADES_HISTORY_FETCH:
        case P2P_TRADES_HISTORY_DATA:
        case P2P_TRADES_HISTORY_ERROR:
            const tradesHistoryState = { ...state.tradesHistory };

            return {
                ...state,
                tradesHistory: tradesHistoryReducer(tradesHistoryState, action),
            };
        default:
            return state;
    }
};
