export const KraEndpoint = "https://kra-seller-api.dt.r.appspot.com";

export interface Ticket {
    user_id: string;
    horse: number[];
    type: string;
    option: string;
    optNum: number;
    bet: number;
    race: number;
}

export interface FormationTicket {
    user_id: string;
    f: number[];
    s: number[];
    t: number[];
    type: string;
    option: string;
    optNum: number;
    bet: number;
    race: number;
}
