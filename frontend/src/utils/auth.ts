import { credentials } from "../data/mockData";

export const login = (email: string, password: string) => {
  const success = email === credentials.email && password === credentials.password;
  if (success) {
    localStorage.setItem("roadwatch_token", "roadwatch-auth-token");
  }
  return success;
};

export const logout = () => {
  localStorage.removeItem("roadwatch_token");
};

export const isAuthenticated = () => Boolean(localStorage.getItem("roadwatch_token"));
