import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://eager-chatelet.74-208-160-68.plesk.page/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      // const token ='5|O83Qtjwlnn9A9VN0fpP77k0Tg9Nlm0wfJvScb2uK27c6324a'
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
        url: 'user/register',
        method: 'POST',
        body: formData,
      }),
    }),

     // ----------- GET ALL USERS ------------
     getAllUsers: builder.query({
      query: () => ({
        url: 'users',
        method: 'GET',
      }),
    
    }),
    
    // ----------------- DELETE USER -----------
    // ----------- DELETE USER API ------------
deleteUser: builder.mutation({
  query: (id) => ({
    url: `user/${id}`,
    method: 'DELETE',
  }),
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

export const { useLoginMutation, useRegisterMutation, useGetAllUsersQuery, useLogoutMutation, useDeleteUserMutation} = api;
