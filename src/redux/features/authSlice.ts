import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../store/store";

interface AuthState {
  role: string | null;
  token: string | null;
  adminInfo: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileImage: any;
    adminName: string | null;
    email: string | null;
    phone: string | null;
    country: string | null;
    province: string | null;
    city: string | null;
    bio: string | null;
  };
}

const initialState: AuthState = {
  role: null,
  token: null,
  adminInfo: {
    profileImage: null,
    adminName: null,
    email: null,
    phone: null,
    country: null,
    province: null,
    city: null,
    bio: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log(action);
      state.role = action.payload.adminInfo.role;
      state.token = action.payload.accessToken;
      state.adminInfo = action.payload.adminInfo;
    },
    logout: (state) => {
      state.token = null;
      Cookies.remove("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export const useAuth = (state: RootState) => state.auth;
