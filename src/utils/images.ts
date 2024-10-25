    
import wk from '../assets/wk.png';
import wq from '../assets/wq.png';
import wr from '../assets/wr.png';
import wb from '../assets/wb.png';
import wn from '../assets/wn.png';
import wp from '../assets/wp.png';
import bk from '../assets/bk.png';
import bq from '../assets/bq.png';
import br from '../assets/br.png';
import bb from '../assets/bb.png';
import bn from '../assets/bn.png';
import bp from '../assets/bp.png';
import { ColorName, fullPieceNames, PieceName } from '@/types/chess';

const pieceImages: Record<ColorName, Record<PieceName, string>> = {
    w: {
        p: wp,
        n: wn,
        b: wb,
        r: wr,
        q: wq,
        k: wk,
    },
    b: {
        p: bp,
        n: bn,
        b: bb,
        r: br,
        q: bq,
        k: bk,
    },
}

export function asImageSrc(colorName: ColorName, pieceName: PieceName) {
    return pieceImages[colorName][pieceName];
}

export function asImageAlt(colorName: ColorName, pieceName: PieceName) {
    return `${colorName === 'w' ? 'white' : 'black'} ${fullPieceNames[pieceName]}`;
}

export default pieceImages;