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
  tagTypes: ["Users", "Inventory", "leads", 'Investment'],
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


    // ---------------------------------- Inventory APIs ---------------------------------
    getAllInventory: builder.query({
      query: () => ({
        url: 'get/inventories',
        method: 'GET',
      }),
      providesTags: ["Inventory"],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: 'get/category',
        method: 'GET',
      }),
      // providesTags: ["Inventory"], 

    }),

    getSubCategories: builder.mutation({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'GET',
      }),
    }),
    addInventory: builder.mutation({
      query: (inventoryData) => ({
        url: 'add/inventory',
        method: 'POST',
        body: inventoryData,
      }),
      invalidatesTags: ["Inventory"],
    }),
    editInventory: builder.mutation({
      query: (inventoryData) => ({
        url: 'add/inventory', 
        method: 'POST',
        body: inventoryData,
      }),
      invalidatesTags: ["Inventory"],

    }),
    getInventoryById: builder.query({
      query: (id) => ({
        url: `get/inventory/${id}`,
        method: 'GET',
      }),
      providesTags: ["Inventory"], 

    }), 
 
    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `delete/inventory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Inventory"],

    }),
    // add lead endpoint
    addLead: builder.mutation({
      query: (leadData) => ({
        url: 'add/lead',
        method: 'POST',
        body: leadData,
      }),
    }),
    getAllLeads: builder.query({
      query: () => ({
        url: 'get/leads',
        method: 'GET',
      }),
      providesTags: ["leads"],
     
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `delete/lead/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["leads"],

    }),
    promoteToInvestor: builder.mutation({
      query: (promoteData) => ({
        url: 'promote/investor', 
        method: 'POST',
        body: promoteData,
      }),
      invalidatesTags: ["leads"],

    }),
    getLeadById: builder.query({
      query: (id) => ({
        url: `get/lead/${id}`,
        method: 'GET',
      }),
      providesTags: ["leads"], 

    }),

    editLead: builder.mutation({
      query: (leadData) => ({
        url: 'add/lead', 
        method: 'POST',
        body: leadData,
      }),
      invalidatesTags: ["leads"],

    }),


    // ----------------------------------------- Investors API -------------------
    addInvestment: builder.mutation({
      query: (lnvestmentData) => ({
        url: 'add/investment', 
        method: 'POST',
        body: lnvestmentData,
      }),
      invalidatesTags: ["Investment"],

    }),
    getAllAdminInvestments: builder.query({
      query: (id) => ({
        url: `get/investment/${id}`,
        method: 'GET',
      }),
      providesTags: ["Investment"],
     
    }),

  }),

});



export const { useLoginMutation,
  useRegisterMutation,
  useGetAllUsersQuery,
  useLogoutMutation,
  useDeleteUserMutation,
  useSingleUserQuery,
  useGetAllInventoryQuery,
  useGetAllCategoriesQuery,
  useGetSubCategoriesMutation,
  useAddInventoryMutation,
  useDeleteInventoryMutation,
  useGetInventoryByIdQuery,
  useAddLeadMutation,
  useGetAllLeadsQuery,
  useDeleteLeadMutation,
  useEditInventoryMutation,
  usePromoteToInvestorMutation,
  useGetLeadByIdQuery,
  useEditLeadMutation,
  useAddInvestmentMutation,
  useGetAllAdminInvestmentsQuery,
} = api;
