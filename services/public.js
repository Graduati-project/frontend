import api from "../lib/apis";

export async function getPublicDoctors() {
  const response = await api.get("/staff/doctors");
  return response.data;
}

export async function getPublicDoctorDetails(doctorId) {
  const response = await api.get(`/staff/doctors/${doctorId}`);
  return response.data;
}

