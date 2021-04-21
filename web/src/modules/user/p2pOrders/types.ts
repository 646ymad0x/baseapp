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
    base: string;
    quote: string;
    expiry_time: string;
    side: string;
    price: string;
    created_at: string;
    time_limit: string;
    state: string;
    dispute: P2PDispute | null;
    user_uid: string;
}

export interface P2PDispute {
    id: string | number;
}
