import { UseNavigateResult } from '@tanstack/react-router';
import React from 'react';

import { FaceState } from 'components/Face';

import { GameParams, GameUpdate } from 'api/entities';

import { GameApi } from '@/api/game';

export type GameResetParams = {
    gameParams?: GameParams;
    presetName?: string;
    navigate: UseNavigateResult<'/game/$session_id'>;
};

export type GameContext = {
    session?: GameUpdate & { api: GameApi };
    presetName: string;
    params: GameParams;
    pressedCells?: number[];
    over: boolean;
    playtime_ms: number;
    flags: number;
    face: FaceState;
    seed: string;
    init: (update: GameUpdate) => void;
    reset: (args: GameResetParams) => void;
    openCell: (x: number, y: number, navigate: UseNavigateResult<string>) => void;
    flagCell: (x: number, y: number) => void;
    cellDown: (x: number, y: number, prevState: number) => void;
    cellUp: (x: number, y: number, prevState: number) => void;
    cellLeave: () => void;
};

export const GameContext = React.createContext<GameContext>(null!);

export const useGame = () => React.useContext(GameContext);
