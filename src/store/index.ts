
'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { api } from './services/api';

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['user', 'ads', 'savedListing'],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// 'use client';

// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage'; 
// import { persistReducer, persistStore } from 'redux-persist';
// import { api } from './services/api';
 

// const persistConfig = {
//   key: 'root',
//   storage,
// //   whitelist: ['user', 'ads','savedListing'],
// };

// const rootReducer = combineReducers({

//   [api.reducerPath]: api.reducer, 
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
  

// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
