import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string | null;
}

const loadState = (): UserState => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch (error) {
    console.error("Error loading user state:", error);
    return { user: null, token: null };
  }
};

const initialState: UserState = loadState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
   
updateUserData: (state, action: PayloadAction<{ user: User }>) => {
  state.user = action.payload.user;
  localStorage.setItem("user", JSON.stringify(action.payload.user));
  
},
      clearUser: (state) => {
        state.user = null;
        state.token = null;

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        const expireCookie = (name:any) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };
      
        expireCookie("accessToken");
        expireCookie("role");

      },
  },
});

export const { setUser,updateUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;
export const userReducer = userSlice.reducer; 
