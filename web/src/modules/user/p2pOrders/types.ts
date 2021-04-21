import { Offer } from "src/modules";

export interface P2POrderCreate {
    offer_id: number;
    amount: number;
    side: string;
}

export interface P2POrder {
    id: number;
    offer: Offer;
    amount: number;
}

export interface P2PTradesHistory {
    created_at: string;
    side: string;
    price: number | string;
    amount: number | string;
    counterparty: number | string;
    status: string;
    quote: string;
    base: string;
}
