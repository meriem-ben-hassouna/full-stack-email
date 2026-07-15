import api from "./api.js";

export async function registerManager({ name, email, password, companyName, companyCode }) {
  const { data } = await api.post("/users/register/manager", {
    name,
    email,
    password,
    company_name: companyName,
    company_code: companyCode,
  });
  return data;
}

export async function registerEmployee({ name, email, password, companyName, companyCode }) {
  const { data } = await api.post("/users/register/employee", {
    name,
    email,
    password,
    company_name: companyName,
    company_code: companyCode,
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/users/login", { email, password });
  return data;
}
