import api from "../lib/apis";





export async function getspecialties() {
    const response = await api.get("/patient/specialties", { withAuth: true });
    return response.data;
}
export async function getspecialtiesById(id) {
    const response = await api.get(`/patient/specialties/${id}`, {
        withAuth: true,
    });
    return response.data;
}
export async function getappointments() {
    const response = await api.get("/patient/appointments", { withAuth: true });
    return response.data;
}

export async function getmydoctors() {
    const response = await api.get("/patient/my-doctors", { withAuth: true });
    return response.data;
}

export async function addappointment(data) {
    const response = await api.post("/patient/book", data, { withAuth: true });
    return response.data;
}

export async function cancelappointment(id) {
    const response = await api.patch(
        `/patient/appointments/${id}/cancel`,
        {},
        { withAuth: true }
    );
    return response.data;
}

export async function specialitydoctor() {
    const response = await api.get(`/patient/specialties/overview`, { withAuth: true });
    return response.data;
}
export async function specialitydoctorbyid(id) {
    const response = await api.get(`/patient/specialties/overview/${id}`, { withAuth: true });
    return response.data;
}

export async function getPatientReviews(params = {}) {
    const response = await api.get("/patient/reviews", {
        params,
        withAuth: true,
    });
    return response.data;
}

export async function postPatientReview(body) {
    const response = await api.post("/patient/reviews", body, { withAuth: true });
    return response.data;
}

export async function getPatientMedicalFiles(params = {}) {
    const response = await api.get("/patient/medical-files", {
        params,
        withAuth: true,
    });
    return response.data;
}

export async function uploadPatientMedicalFile({ file, appointmentId }) {
    const form = new FormData();
    form.append("file", file);
    if (appointmentId) {
        form.append("appointmentId", appointmentId);
    }
    const response = await api.post("/patient/medical-files", form, {
        withAuth: true,
    });
    return response.data;
}