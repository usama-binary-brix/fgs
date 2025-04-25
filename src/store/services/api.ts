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
  tagTypes: ["Users", "Inventory", "leads", 'Investment', "userLead", "UserInvestment", "InventoryTimeline", "allEmployees", "AllAdminTasks", "EmployeeInventory", "AllEmployeeTasks", "AllShipments", "InventoryCost", "AllShipmentOpportunities", "AllShipmentQuotes"],
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
      query: ({ page = 1, perPage = 10, search }) => ({
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
      query: ({ page = 1, perPage = 10, search }) => ({
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
      query: ({ page = 1, perPage = 10, search }) => ({
        url: `get/leads?per_page=${perPage}&page=${page}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ["leads"],
    }),

    getAllUserLeads: builder.query({
      query: ({ page = 1, perPage = 10, search }) => ({
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
      query: ({ page = 1, perPage = 10, search }) => ({
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
      invalidatesTags: ["AllAdminTasks", "InventoryTimeline"],
    }),

    getAllAdminEmployeeTasks: builder.query({
      query: (id) => ({
        url: `get/inventory/task/${id}`,
        method: 'GET',
      }),
      providesTags: ["AllAdminTasks"],
    }),
    deleteTimeline: builder.mutation({
      query: (id) => ({
        url: `timeline/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["InventoryTimeline"],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `employee/task/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["AllAdminTasks", "InventoryTimeline"],
    }),
    getTaskById: builder.query({
      query: (id) => ({
        url: `get/task/${id}`,
        method: 'GET',
      }),
      providesTags: ["AllAdminTasks"],

    }),

    updateTask: builder.mutation({
      query: (taskData) => ({
        url: 'add/employee/task',
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: ["AllAdminTasks", "InventoryTimeline"],
    }),

    addTaskStatus: builder.mutation({
      query: (taskStatusData) => ({
        url: 'employee/task/status',
        method: 'POST',
        body: taskStatusData,
      }),
      invalidatesTags: ["AllAdminTasks", "InventoryTimeline", "AllEmployeeTasks", "EmployeeInventory"],

    }),


    getAllEmployeeInventory: builder.query({
      query: ({ page = 1, perPage = 10, search }) => ({
        url: `task/inventory?per_page=${perPage}&page=${page}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ["EmployeeInventory"],
    }),

    getAllEmployeesTasks: builder.query({
      query: (id) => ({
        url: `get/employee/task/${id}`,
        method: 'GET',
      }),
      providesTags: ["AllEmployeeTasks"],
    }),


    addInventoryCost: builder.mutation({
      query: (costData) => ({
        url: 'add/timeline/price',
        method: 'POST',
        body: costData,
      }),
      invalidatesTags: ["InventoryCost", "InventoryTimeline"],
    }),

    calculateProfit: builder.mutation({
      query: (sellingPrice) => ({
        url: 'calculate/inventory/profit',
        method: 'POST',
        body: sellingPrice,
      }),
      // invalidatesTags: ["InventoryCost",]
    }),

    addSellingPrice: builder.mutation({
      query: (sellingPrice) => ({
        url: 'add/inventory/selling/price',
        method: 'POST',
        body: sellingPrice,
      }),
      // invalidatesTags: ["InventoryCost",]
    }),

    getInventorySellingPrice: builder.query({
      query: (id) => ({
        url: `inventory/profit/${id}`,
        method: 'GET',
      }),
      // providesTags: ["AllEmployeeTasks"],
    }),

    employeeTaskStatus: builder.query({
      query: (id) => ({
        url: `get/task/status/${id}`,
        method: 'GET',
      }),
      // providesTags: ["AllEmployeeTasks"],
    }),


    addNewShipment: builder.mutation({
      query: (shipmentData) => ({
        url: 'add/shipment',
        method: 'POST',
        body: shipmentData,
      }),
      invalidatesTags: ["AllShipments",],
    }),

    getAllShipments: builder.query({
      query: ({ id, shipmentType }) => ({
        url: `all/shipment/${id}?shipment=${shipmentType}`,
        method: 'GET',
      }),
      providesTags: ["AllShipments"],
    }),

    deleteShipment: builder.mutation({
      query: (id) => ({
        url: `shipment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["AllShipments"],
    }),

    getAllShipmentOpportunities: builder.query({
      query: ({ page = 1, perPage = 10, search }) => ({
        url: `get/shipment?per_page=${perPage}&page=${page}&search=${search}`,
        method: 'GET',
      }),
      providesTags: ["AllShipmentOpportunities"],
    }),
    getShipmentById: builder.query({
      query: (id) => ({
        url: `get/shipment/${id}`,
        method: 'GET',
      }),
      providesTags: ["AllShipmentOpportunities"],

    }),

    addShipmentQuote: builder.mutation({
      query: (data) => ({
        url: 'add/shipment/qoute',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["AllShipmentOpportunities",],
    }),

    getAllShipmentQuotes: builder.query({
      query: ({ id, page = 1, perPage = 10 }) => ({
        url: `get/inventory/shipment/qoute/${id}?per_page=${perPage}&page=${page}`,

        method: 'GET',
      }),
      providesTags: ["AllShipmentQuotes"],
    }),

    updateShipmentQuotesStatus: builder.mutation({
      query: (statusData) => ({
        url: 'shipment/qoute/status',
        method: 'POST',
        body: statusData,
      }),
      invalidatesTags: ["AllShipmentQuotes"],

    }),

    getBrokerShipmentById: builder.query({
      query: (id) => ({
        url: `get/shipment/qoute/${id}`,
        method: 'GET',
      }),
      // providesTags: ["AllShipmentOpportunities"],

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
  useDeleteTimelineMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useAddTaskStatusMutation,
  useGetAllEmployeeInventoryQuery,
  useGetAllEmployeesTasksQuery,
  useAddNewShipmentMutation,
  useAddInventoryCostMutation,
  useCalculateProfitMutation,
  useAddSellingPriceMutation,
  useGetInventorySellingPriceQuery,
  useEmployeeTaskStatusQuery,
  useGetAllShipmentsQuery,
  useDeleteShipmentMutation,
  useGetAllShipmentOpportunitiesQuery,
  useGetShipmentByIdQuery,
  useAddShipmentQuoteMutation,
  useGetAllShipmentQuotesQuery,
  useUpdateShipmentQuotesStatusMutation,
  useGetBrokerShipmentByIdQuery,



} = api;
