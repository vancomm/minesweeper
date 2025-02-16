import { createURLSearchParams, validateFetcher } from 'api/common';
import { CellParams, GameParams, GameRecord, GameUpdate } from 'api/entities';

import { API_PREFIX } from '@/constants';

type GetRecordsProps = {
    username?: string;
    seed?: string;
};

export const fetchHighscores = validateFetcher(GameRecord.array(), (search?: GetRecordsProps) =>
    fetch(`${API_PREFIX}/game/highscore?` + createURLSearchParams(search).toString(), { credentials: 'include' })
);

export const createNewGame = validateFetcher(GameUpdate, (search: CellParams & GameParams) =>
    fetch(`${API_PREFIX}/game/?` + createURLSearchParams(search).toString(), {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
    })
);

export const getWSConnectURL = (session_id: string) => `${API_PREFIX}/game/${session_id}/connect`;

export const newGameApi = (session_id: string) => ({
    fetchGame: validateFetcher(GameUpdate, () => fetch(`${API_PREFIX}/game/${session_id}`)),
    openCell: validateFetcher(GameUpdate, (search: CellParams) =>
        fetch(`${API_PREFIX}/game/${session_id}/open?` + createURLSearchParams(search).toString(), {
            method: 'POST',
            credentials: 'include',
        })
    ),
    flagCell: validateFetcher(GameUpdate, (search: CellParams) =>
        fetch(`${API_PREFIX}/game/${session_id}/flag?` + createURLSearchParams(search).toString(), {
            method: 'POST',
            credentials: 'include',
        })
    ),
    chordCell: validateFetcher(GameUpdate, (search: CellParams) =>
        fetch(`${API_PREFIX}/game/${session_id}/chord?` + createURLSearchParams(search).toString(), {
            method: 'POST',
            credentials: 'include',
        })
    ),
});

export type GameApi = ReturnType<typeof newGameApi>;
