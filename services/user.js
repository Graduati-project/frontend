import api from "../lib/apis";

export async function profile() {
  const response = await api.get("/user/profile", { withAuth: true });
  return response.data;
}