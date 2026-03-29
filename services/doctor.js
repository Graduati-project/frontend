import api from "../lib/apis";

export async function getDoctorAppointments() {
  const response = await api.get("/doctor/appointments", { withAuth: true });
  return response.data;
}

export async function getDoctorPatients() {
  const response = await api.get("/doctor/patients", { withAuth: true });
  return response.data;
}

export async function updateAppointmentStatus(id, status) {
  const response = await api.patch(
    `/doctor/appointments/${id}/status`,
    { status },
    { withAuth: true }
  );
  return response.data;
}

export async function addTreatment(data) {
  const response = await api.post("/doctor/treatments", data, {
    withAuth: true,
  });
  return response.data;
}

export async function updateTreatment(id, data) {
  const response = await api.put(`/doctor/treatments/${id}`, data, {
    withAuth: true,
  });
  return response.data;
}
