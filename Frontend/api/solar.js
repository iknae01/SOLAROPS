import api from "./client";

export const predictNormal = (file, email, password) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", email);
  formData.append("password", password);

  return api.post("/predict/normal", formData);
};

export const predictThermal = (file, email, password) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", email);
  formData.append("password", password);

  return api.post("/predict/thermal", formData);
};

export const login = (email, password) =>
  api.post("/login", { email, password });

export const register = (email, password) =>
  api.post("/register", { email, password });