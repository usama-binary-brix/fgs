
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'base-url/api/' }), 
  endpoints: (builder) => ({
    getExampleData: builder.query<any, void>({
      query: () => 'example-endpoint',
    }),
  }),
});

export const { useGetExampleDataQuery } = api;
