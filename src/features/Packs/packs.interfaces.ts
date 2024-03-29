// =========API==========
import { SortTypes } from 'common/utils/types/sort.types';
import { buttonRowConst } from './utils/constans/button-row.const';

export interface IPack {
    _id: string;
    user_id: string;
    user_name: string;
    private: boolean;
    name: string;
    path: string;
    grade: number;
    shots: number;
    deckCover: string;
    cardsCount: number;
    type: string;
    rating: number;
    created: string;
    updated: string;
    more_id: string;
}

export interface IPacks {
    cardPacks: IPack[];
    page: number;
    pageCount: number;
    cardPacksTotalCount: number;
    minCardsCount: number;
    maxCardsCount: number;
}

export interface ICardsPackRes {
    newCardsPack: IPack;
}

interface IPackQuery {
    page: string;
    pageCount: string;
    sortPacks: string;
    packName: string;
    user_id: string;
    min: string;
    max: string;
}

export interface IAddPack {
    cardsPack: {
        name: string;
        deckCover: string;
        private: boolean;
    };
}

export interface IChangePack {
    cardsPack: {
        _id: string;
        name: string;
        private: boolean;
    };
}

export type PackQueryTypes = Partial<Record<keyof IPackQuery, string>>;
// ============DOMAIN============
export interface PacksRow {
    _id: string;
    name: string;
    cards: number;
    updated: string;
    created: string;
    actions: typeof buttonRowConst;
    user_id: string;
    private: boolean;
}

export type PackSortTypes = 'name' | 'cardsCount' | 'updated' | 'created' | 'actions';

export type PackSortRequestTypes = `${SortTypes}name` | `${SortTypes}cardsCount` | `${SortTypes}updated` | `${SortTypes}created` | `${SortTypes}actions`;
