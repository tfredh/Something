export interface JWTDetails {
    username: string;
    id: number;
    iat: number;
}

export interface Like {
    id: number;
    post_id: number;
    username: string;
}