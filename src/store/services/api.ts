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
  tagTypes: ["Users", "Inventory", "leads", 'Investment', "userLead", "UserInvestment", "InventoryTimeline", "allEmployees", "AllAdminTasks"],
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

    getAllUsers: builder.query({
      query: ({ page = 1, perPage = 10 , search}) => ({
        url: `users?per_page=${perPage}&page=${page}&search=${search}`,
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

    forgetPassword: builder.mutation({
      query: (formData) => ({
        url: "forgot-password",
        method: "POST",
        body: formData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (formData) => ({
        url: "reset-password",
        method: "POST",
        body: formData,
      }),
    }),
    getAllEmployees: builder.query({
      query: () => ({
        url: `get/employee`,
        method: 'GET',
      }),
      providesTags: ["allEmployees"],
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
      query: ({ page = 1, perPage = 10 , search}) => ({
        url: `get/inventories?per_page=${perPage}&page=${page}&search=${search}`,
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
      invalidatesTags: ["leads", 'userLead'],

    }),
   

    getAllLeads: builder.query({
      query: ({ page = 1, perPage = 10 , search}) => ({
        url: `get/leads?per_page=${perPage}&page=${page}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ["leads"],
    }),

    getAllUserLeads: builder.query({
      query: ({ page = 1, perPage = 10 , search}) => ({
        url: `get/lead?per_page=${perPage}&page=${page}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ["userLead"],
     
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `delete/lead/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["leads", 'userLead'],

    }),
    promoteToInvestor: builder.mutation({
      query: (promoteData) => ({
        url: 'promote/investor', 
        method: 'POST',
        body: promoteData,
      }),
      invalidatesTags: ["leads", "userLead"],

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

    getAllUserInvestments: builder.query({
      query: ({ page = 1, perPage = 10 , search}) => ({
        url: `get/investment?per_page=${perPage}&page=${page}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ["UserInvestment"],
     
    }),
    updateInvestorStatus: builder.mutation({
      query: (lnvestorData) => ({
        url: 'investment/update-status', 
        method: 'POST',
        body: lnvestorData,
      }),
      invalidatesTags: ["Investment"],

    }),
    addNewTimeline: builder.mutation({
      query: (timelineData) => ({
        url: 'add/timeline', 
        method: 'POST',
        body: timelineData,
      }),
      invalidatesTags: ["InventoryTimeline"],

    }),

    ReorderTimeline: builder.mutation({
      query: (reorderData) => ({
        url: 'reorder/timeline', 
        method: 'POST',
        body: reorderData,
      }),
      invalidatesTags: ["InventoryTimeline"],

    }),
    getAllTimeline: builder.query({
      query: (inventory_id) => ({
        url: `get/timeline/${inventory_id}`,
        method: 'GET', 
      }),
      providesTags: ["InventoryTimeline"],
    }),

    addNewTask: builder.mutation({
      query: (taskData) => ({
        url: 'add/employee/task', 
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: ["AllAdminTasks"],
    }),

    getAllAdminEmployeeTasks: builder.query({
      query: (id) => ({
        url: `get/employee/${id}`,
        method: 'GET', 
      }),
      providesTags: ["AllAdminTasks"],
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
  useUpdateInvestorStatusMutation,
  useGetAllUserLeadsQuery,
  useGetAllUserInvestmentsQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetAllTimelineQuery,
  useAddNewTimelineMutation,
  useReorderTimelineMutation,
  useGetAllEmployeesQuery,
  useAddNewTaskMutation,
  useGetAllAdminEmployeeTasksQuery,
  
} = api;
