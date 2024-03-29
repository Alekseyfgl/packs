import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { appReducer } from '../app/app.slice';
import { authReducer } from '../features/Auth/auth.slice';
import { packReducer } from '../features/Packs/packs.slice';
import { cardReducer } from '../features/Cards/cards.slice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        packs: packReducer,
        cards: cardReducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
