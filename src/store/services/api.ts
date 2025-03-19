import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://binarybrix.com/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // ----------- LOGIN API ------------
    login: builder.mutation({
      query: (credentials) => ({
        url: 'user/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // ----------- REGISTER API ------------
  
    register: builder.mutation({
      query: (formData) => ({
        url: "user/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),

     // ----------- GET ALL USERS ------------
     getAllUsers: builder.query({
      query: () => ({
        url: 'users',
        method: 'GET',
      }),
      providesTags: ["Users"], 

    }),
    
    // ----------- DELETE USER API ------------
deleteUser: builder.mutation({
  query: (id) => ({
    url: `user/${id}`,
    method: 'DELETE',
  }),
  invalidatesTags: ["Users"],
}),
    // ----------- SINGLE USER API ------------
    singleUser: builder.query({
      query: (id) => ({
        url: `user/${id}`,
        method: 'GET',
      }),
      providesTags: ["Users"], 
}),


    // ----------- LOGOUT API ------------
    logout: builder.mutation({
      query: () => ({
        url: 'user/logout',
        method: 'POST',
      }),
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;
      //     localStorage.removeItem('token');
      //   } catch (err) {
      //     console.error('Logout failed: ', err);
      //   }
      // },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetAllUsersQuery, useLogoutMutation, useDeleteUserMutation, useSingleUserQuery } = api;
