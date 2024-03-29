import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk, thunkTryCatch } from '../../common/utils/thunks';
import { packsApi } from './packs.api';
import { IAddPack, IChangePack, IPacks, PackQueryTypes } from './packs.interfaces';
import { Nullable } from '../../common/utils/types/optional.types';
import { logout } from '../Auth/auth.slice';

const slice = createSlice({
    name: 'packs',
    initialState: {
        packs: null as Nullable<IPacks>,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllPacks.fulfilled, (state, action) => {
            state.packs = action.payload.packs;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.packs = null;
        });
    },
});

const getAllPacks = createAppAsyncThunk<{ packs: IPacks }, PackQueryTypes>('packs/getAllPacks', async (arg: PackQueryTypes, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
        const res = await packsApi.allPacks(arg);
        return { packs: res.data };
    });
});

// createAppAsyncThunk <responseType, requestType>
const addPack = createAppAsyncThunk<void, { dto: IAddPack; queryParams: PackQueryTypes }>(
    'packs/addPack',
    async (arg: { dto: IAddPack; queryParams: PackQueryTypes }, thunkAPI) => {
        const { dispatch, getState, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            await packsApi.addPack(arg.dto);
            const res: { packs: IPacks } = await dispatch(packThunks.getAllPacks(arg.queryParams)).unwrap();
            return { packs: res.packs };
        });
    }
);

const removePack = createAppAsyncThunk<{ packs: IPacks }, { dto: { id: string }; queryParams: PackQueryTypes }>(
    'packs/remove',
    async (arg: { dto: { id: string }; queryParams: PackQueryTypes }, thunkAPI) => {
        const { dispatch, getState, rejectWithValue } = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            await packsApi.removePack(arg.dto);
            const res: { packs: IPacks } = await dispatch(packThunks.getAllPacks(arg.queryParams)).unwrap();
            return { packs: res.packs };
        });
    }
);

const updatePack = createAppAsyncThunk<{ packs: IPacks }, { dto: IChangePack; queryParams: PackQueryTypes }>(
    'packs/updatePack',
    async (arg: { dto: IChangePack; queryParams: PackQueryTypes }, thunkAPI) => {
        const { dispatch, getState, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const { dto, queryParams } = arg;
            await packsApi.updatePack(dto);
            const res = await dispatch(packThunks.getAllPacks(queryParams)).unwrap();
            return { packs: res.packs };
        });
    }
);

export const packReducer = slice.reducer;
export const packActions = slice.actions;
export const packThunks = { getAllPacks, addPack, removePack, updatePack };
