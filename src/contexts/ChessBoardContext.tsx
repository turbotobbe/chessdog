import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ChessBoardController } from "./ChessBoardController";

export type ChessBoardContextType = {
    addController: (key: string, controller: ChessBoardController) => void,
    setController: (key: string, controller: ChessBoardController) => void,
    getController: (key: string) => ChessBoardController | undefined
}

const ChessBoardContext = createContext<ChessBoardContextType | null>(null);

export const ChessBoardProvider = ({ children }: { children: React.ReactNode }) => {

    const [chessBoardControllers, setChessBoardControllers] = useState<Record<string, ChessBoardController>>({});

    const addController = useCallback((key: string, controller: ChessBoardController) => {
        // console.log("addController", key);
        if (chessBoardControllers[key]) {
            console.warn(`Chess board with key ${key} already exists`);
            return;
        }
        setChessBoardControllers((prevControllers) => ({
            ...prevControllers,
            [key]: controller.clone()
        }));
    }, []);

    const setController = useCallback((key: string, controller: ChessBoardController) => {
        // console.log("setController", key, controller);
        setChessBoardControllers((prevControllers) => ({
            ...prevControllers,
            [key]: controller.clone()
        }));
    }, []);

    const getController = useCallback((key: string): ChessBoardController | undefined => {
        // console.log("getController", key);
        if (!chessBoardControllers[key]) {
            console.warn(`Chess board with key ${key} does not exist`);
        }
        return chessBoardControllers[key];
    }, [chessBoardControllers]);

    const value: ChessBoardContextType = useMemo(() => ({
        addController,
        setController,
        getController
    }), [addController, setController, getController]);

    // console.log("ChessBoardProvider", value);
    return (<ChessBoardContext.Provider value={value}>
        {children}
    </ChessBoardContext.Provider>);
};

export const useChessBoard = (): ChessBoardContextType => {
    const context = useContext(ChessBoardContext);
    if (!context) {
        throw new Error("useChessBoard must be used within a ChessBoardProvider");
    }
    return context;
}
