import { createSearchParams, validateFetcher } from 'api/common'
import { CellParams, GameParams, GameRecord, GameUpdate } from 'api/entities'

import { API_URL as ENDPOINT } from '@/constants'

type GetRecordsProps = {
    username?: string
    seed?: string
}

export const fetchRecords = validateFetcher(
    GameRecord.array(),
    (search?: GetRecordsProps) =>
        fetch(`${ENDPOINT}/records?` + createSearchParams(search).toString(), {
            credentials: 'include',
        })
)

export const fetchMyRecords = validateFetcher(GameRecord.array(), () =>
    fetch(`${ENDPOINT}/myrecords`, { credentials: 'include' })
)

export const createNewGame = validateFetcher(
    GameUpdate,
    (search: CellParams & GameParams) =>
        fetch(`${ENDPOINT}/game?` + createSearchParams(search).toString(), {
            method: 'POST',
            credentials: 'include',
        })
)

export const newGameApi = (session_id: string) => ({
    fetchGame: validateFetcher(GameUpdate, () =>
        fetch(`${ENDPOINT}/game/${session_id}`)
    ),
    openCell: validateFetcher(GameUpdate, (search: CellParams) =>
        fetch(
            `${ENDPOINT}/game/${session_id}/open?` +
                createSearchParams(search).toString(),
            {
                method: 'POST',
                credentials: 'include',
            }
        )
    ),
    flagCell: validateFetcher(GameUpdate, (search: CellParams) =>
        fetch(
            `${ENDPOINT}/game/${session_id}/flag?` +
                createSearchParams(search).toString(),
            {
                method: 'POST',
                credentials: 'include',
            }
        )
    ),
    chordCell: validateFetcher(GameUpdate, (search: CellParams) =>
        fetch(
            `${ENDPOINT}/game/${session_id}/chord?` +
                createSearchParams(search).toString(),
            {
                method: 'POST',
                credentials: 'include',
            }
        )
    ),
})

export type GameApi = ReturnType<typeof newGameApi>
