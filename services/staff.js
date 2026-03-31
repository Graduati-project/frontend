
import api from "../lib/apis";

export async function getStaffDoctors() {
  const response = await api.get("/staff/doctors", { withAuth: true });
  return response.data;
}

export async function getStaffPatients() {
  const response = await api.get("/staff/patients", { withAuth: true });
  return response.data;
}

export async function getStaffPatientById(id) {
  const response = await api.get(`/staff/patients/${id}`, { withAuth: true });
  return response.data;
}

export async function getStaffAppointments() {
  const response = await api.get("/staff/appointments", { withAuth: true });
  return response.data;
}

export async function addStaffDoctor(data) {
  const response = await api.post("/staff/doctors", data, { withAuth: true });
  return response.data;
}

export async function addStaffPatient(data) {
  const response = await api.post("/staff/staff", data, { withAuth: true });
  return response.data;
}

export async function addStaffUser(data) {
  const response = await api.post("/staff/staff", data, { withAuth: true });
  return response.data;
}

export async function getStaffSpecialties() {
  const response = await api.get("/staff/specialties", { withAuth: true });
  return response.data;
}