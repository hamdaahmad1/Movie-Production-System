export interface LoginData {
    login: string;
    password: string;
  }
  
  export interface RegisterData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "VIEWER" | "EDITOR";
  }
  
  export interface LoginResponse {
    message: string;
    user: {
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "ADMIN" | "EDITOR" | "VIEWER";
    };
  }
  
  export interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    login?: string;
    general?: string;
  }