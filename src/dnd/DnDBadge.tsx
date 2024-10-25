import React from 'react';
import { DnDBadgeName } from './DnDTypes';

import alternative from '@/assets/badges/alternative_32x.png';
import best from '@/assets/badges/best_32x.png';
import blunder from '@/assets/badges/blunder_32x.png';
import book from '@/assets/badges/book_32x.png';
import brilliant from '@/assets/badges/brilliant_32x.png';
import checkmate_black from '@/assets/badges/checkmate_black_32x.png';
import checkmate_white from '@/assets/badges/checkmate_white_32x.png';
import correct from '@/assets/badges/correct_32x.png';
import critical from '@/assets/badges/critical_32x.png';
import draw_black from '@/assets/badges/draw_black_32x.png';
import draw_white from '@/assets/badges/draw_white_32x.png';
import excellent from '@/assets/badges/excellent_32x.png';
import fast_win from '@/assets/badges/fast_win_32x.png';
import forced from '@/assets/badges/forced_32x.png';
import free_piece from '@/assets/badges/free_piece_32x.png';
import good from '@/assets/badges/good_32x.png';
import great_find from '@/assets/badges/great_find_32x.png';
import inaccuracy from '@/assets/badges/inaccuracy_32x.png';
import incorrect from '@/assets/badges/incorrect_32x.png';
import mate from '@/assets/badges/mate_32x.png';
import missed_win from '@/assets/badges/missed_win_32x.png';
import mistake from '@/assets/badges/mistake_32x.png';
import resign_black from '@/assets/badges/resign_black_32x.png';
import resign_white from '@/assets/badges/resign_white_32x.png';
import sharp from '@/assets/badges/sharp_32x.png';
import take_back from '@/assets/badges/take_back_32x.png';
import threat from '@/assets/badges/threat_32x.png';
import unnamed_clock_black from '@/assets/badges/unnamed_clock_black_32x.png';
import unnamed_clock_white from '@/assets/badges/unnamed_clock_white_32x.png';
import unnamed_redo from '@/assets/badges/unnamed_redo_32x.png';
import unnamed_updown_arrow from '@/assets/badges/unnamed_updown_arrow_32x.png';
import winner from '@/assets/badges/winner_32x.png';

export type DnDBadgeProps = {
    badgeName: DnDBadgeName,
}

const DnDBadge: React.FC<DnDBadgeProps> = ({
    badgeName,
}) => {

    switch (badgeName) {
        case 'alternative':
            return <img className="dnd-badge" src={alternative} alt="alternative" />;
        case 'best':
            return <img className="dnd-badge" src={best} alt="best" />;
        case 'blunder':
            return <img className="dnd-badge" src={blunder} alt="blunder" />;
        case 'book':
            return <img className="dnd-badge" src={book} alt="book" />;
        case 'brilliant':
            return <img className="dnd-badge" src={brilliant} alt="brilliant" />;
        case 'checkmate_black':
            return <img className="dnd-badge" src={checkmate_black} alt="checkmate_black" />;
        case 'checkmate_white':
            return <img className="dnd-badge" src={checkmate_white} alt="checkmate_white" />;
        case 'correct':
            return <img className="dnd-badge" src={correct} alt="correct" />;
        case 'critical':
            return <img className="dnd-badge" src={critical} alt="critical" />;
        case 'draw_black':
            return <img className="dnd-badge" src={draw_black} alt="draw_black" />;
        case 'draw_white':
            return <img className="dnd-badge" src={draw_white} alt="draw_white" />;
        case 'excellent':
            return <img className="dnd-badge" src={excellent} alt="excellent" />;
        case 'fast_win':
            return <img className="dnd-badge" src={fast_win} alt="fast_win" />;
        case 'forced':
            return <img className="dnd-badge" src={forced} alt="forced" />;
        case 'free_piece':
            return <img className="dnd-badge" src={free_piece} alt="free_piece" />;
        case 'good':
            return <img className="dnd-badge" src={good} alt="good" />;
        case 'great_find':
            return <img className="dnd-badge" src={great_find} alt="great_find" />;
        case 'inaccuracy':
            return <img className="dnd-badge" src={inaccuracy} alt="inaccuracy" />;
        case 'incorrect':
            return <img className="dnd-badge" src={incorrect} alt="incorrect" />;
        case 'mate':
            return <img className="dnd-badge" src={mate} alt="mate" />;
        case 'missed_win':
            return <img className="dnd-badge" src={missed_win} alt="missed_win" />;
        case 'mistake':
            return <img className="dnd-badge" src={mistake} alt="mistake" />;
        case 'resign_black':
            return <img className="dnd-badge" src={resign_black} alt="resign_black" />;
        case 'resign_white':
            return <img className="dnd-badge" src={resign_white} alt="resign_white" />;
        case 'sharp':
            return <img className="dnd-badge" src={sharp} alt="sharp" />;
        case 'take_back':
            return <img className="dnd-badge" src={take_back} alt="take_back" />;
        case 'threat':
            return <img className="dnd-badge" src={threat} alt="threat" />;
        case 'unnamed_clock_black':
            return <img className="dnd-badge" src={unnamed_clock_black} alt="unnamed_clock_black" />;
        case 'unnamed_clock_white':
            return <img className="dnd-badge" src={unnamed_clock_white} alt="unnamed_clock_white" />;
        case 'unnamed_redo':
            return <img className="dnd-badge" src={unnamed_redo} alt="unnamed_redo" />;
        case 'unnamed_updown_arrow':
            return <img className="dnd-badge" src={unnamed_updown_arrow} alt="unnamed_updown_arrow" />;
        case 'winner':
            return <img className="dnd-badge" src={winner} alt="winner" />;
        default:
            return null;
    }
};

export default DnDBadge;
