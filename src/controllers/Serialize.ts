import { ChessBoardTree, ChessBoardNode, ChessBoardState } from '@/contexts/ChessBoardState';
import { GridColorName } from '@/dnd/DnDTypes';
import { SquareId } from '@/types/chess';
import { DefaultChessBoardController } from "./DefaultChessBoardController";

interface SerializedNode {
    id: number;
    state: {
        key: string;
        pgn: string;
        whitesTurn: boolean;
        squares: { [square: string]: string };  // Only occupied squares
        moves: [SquareId, SquareId][];
        comments: string[];
        marks: Record<GridColorName, SquareId[]>;
        arrows: Record<GridColorName, [SquareId, SquareId][]>;
    };
    parentId: number;
    childIds: number[];
    childIdx: number;
}

export interface SerializedTree {
    rootId: number;
    currentNodeId: number;
    nodes: { [key: number]: SerializedNode };
}

export function serializeTree(tree: ChessBoardTree): SerializedTree {
    const serializedNodes: { [key: number]: SerializedNode } = {};

    // Serialize each node
    Object.entries(tree.nodes).forEach(([_nodeId, node]) => {
        // Only store occupied squares
        const squares: { [square: string]: string } = {};
        Object.entries(node.state.squares).forEach(([square, pieceId]) => {
            if (pieceId) squares[square] = pieceId;
        });

        // Only include non-empty arrays and objects
        const state: any = {
            key: node.state.key,
            pgn: node.state.pgn,
            whitesTurn: node.state.whitesTurn,
            squares,
            moves: node.state.moves
        };

        // Only add comments if not empty
        if (node.state.comments.length > 0) {
            state.comments = node.state.comments;
        }

        // Only add non-empty marks
        const marks: Partial<Record<GridColorName, SquareId[]>> = {};
        Object.entries(node.state.marks).forEach(([color, squares]) => {
            if (squares.length > 0) {
                marks[color as GridColorName] = squares;
            }
        });
        if (Object.keys(marks).length > 0) {
            state.marks = marks;
        }

        // Only add non-empty arrows
        const arrows: Partial<Record<GridColorName, [SquareId, SquareId][]>> = {};
        Object.entries(node.state.arrows).forEach(([color, arrowList]) => {
            if (arrowList.length > 0) {
                arrows[color as GridColorName] = arrowList;
            }
        });
        if (Object.keys(arrows).length > 0) {
            state.arrows = arrows;
        }

        serializedNodes[node.id] = {
            id: node.id,
            state: state,
            parentId: node.parentId,
            childIds: node.childIds,
            childIdx: node.childIdx
        };
    });

    return {
        rootId: tree.rootId,
        currentNodeId: tree.currentNodeId,
        nodes: serializedNodes
    };
}

export function deserializeTree(serialized: SerializedTree, initialState: ChessBoardState): ChessBoardTree {
    if (!serialized || !serialized.nodes) {
        console.warn("No serialized tree found");
        return new ChessBoardTree(initialState, {
            rootId: 0,
            currentNodeId: 0,
            nodes: {}
        });
    }
    const tree = new ChessBoardTree(initialState, {
        rootId: serialized.rootId,
        currentNodeId: serialized.currentNodeId,
        nodes: {}
    });

    // Deserialize each node
    Object.entries(serialized.nodes).forEach(([_nodeId, node]) => {
        const state = initialState.clone();

        // Restore state properties
        state.key = node.state.key;
        state.pgn = node.state.pgn;
        state.whitesTurn = node.state.whitesTurn;
        state.squares = { ...node.state.squares };
        state.moves = [...node.state.moves];

        state.comments = node.state.comments || [];

        // Initialize empty marks and arrows
        state.marks = {
            red: [],
            blue: [],
            yellow: [],
            green: [],
            orange: []
        };
        state.arrows = {
            red: [],
            blue: [],
            yellow: [],
            green: [],
            orange: []
        };

        // Restore marks if they exist
        if (node.state.marks) {
            Object.entries(node.state.marks).forEach(([color, squares]) => {
                state.marks[color as GridColorName] = squares;
            });
        }

        // Restore arrows if they exist
        if (node.state.arrows) {
            Object.entries(node.state.arrows).forEach(([color, arrowList]) => {
                state.arrows[color as GridColorName] = arrowList;
            });
        }

        // Create node
        tree.nodes[node.id] = new ChessBoardNode(
            node.id,
            state,
            node.parentId,
            [...node.childIds],
            node.childIdx
        );
    });

    return tree;
}

interface SerializedController {
    kind: string;
    tree: SerializedTree;
}

export function serializeController(controller: DefaultChessBoardController): SerializedController {
    return {
        kind: controller.kind,
        tree: serializeTree(controller.gameTree)
    };
}

export function deserializeController(
    serialized: SerializedController,
    initialState: ChessBoardState,
    createController: (kind: string, enableWhite: boolean, enableBlack: boolean) => DefaultChessBoardController
): DefaultChessBoardController {
    // Create new controller
    const controller = createController(serialized.kind, true, true);

    // Replace its tree with our deserialized one

    controller.gameTree = deserializeTree(serialized.tree, initialState);

    return controller;
}