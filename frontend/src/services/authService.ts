import API from "./api";
import { LoginData, RegisterData } from "@/types/auth";
import { User } from "@/types/user";

export const authService = {
  async register(data: RegisterData) {
    const response = await API.post("/auth/register", data, {
      withCredentials: true,
    });

    return response.data;
  },

  async login(data: LoginData) {
    const response = await API.post("/auth/login", data, {
      withCredentials: true,
    });

    return response.data;
  },

  async logout() {
    const response = await API.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  },

  async me(): Promise<User> {
    const response = await API.get("/auth/me", {
      withCredentials: true,
    });

    return response.data;
  },

  async checkUsername(username: string) {
    const response = await API.get("/auth/check-username", {
      params: { username },
    });

    return response.data;
  },

  async checkEmail(email: string) {
    const response = await API.get("/auth/check-email", {
      params: { email },
    });

    return response.data;
  },
};