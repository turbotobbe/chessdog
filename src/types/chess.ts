export interface ChessComGame {
    url: string;
    pgn: string;
    time_control: string;
    end_time: number;
    time_class: string;
    white: {
        rating: number;
        result: string;
        username: string;
    };
    black: {
        rating: number;
        result: string;
        username: string;
    };
}
