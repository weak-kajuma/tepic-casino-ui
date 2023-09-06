export interface Dealer {
    dealer_id: string;
    name: string;
    description: string;
    creator: string;
}

export interface Transaction {
    transaction_id: string;
    user_id: string;
    nickname: string;
    dealer_id: string;
    amount: number;
    type: "bet" | "payout" | "payment" | "gift" | "other";
    detail: string;
    hide_detail: string;
    timestamp: string;
}

export interface User {
    user_id: string;
    nickname: string;
    having_money: number;
    rank?: number;
    transaction_history?: [Transaction];
}

export interface CreateUserResponse {
    user_id: string;
    nickname: string;
    having_money: number;
    token: string;
}

export const endpoint =
    process.env.ENDPOINT ?? "https://money-manager-api.takatsuki.club";
