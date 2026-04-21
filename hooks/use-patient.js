"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    addappointment,
    cancelappointment,
    getappointments,
    getmydoctors,
    getspecialties,
    getspecialtiesById,
    getPatientMedicalFiles,
    getPatientReviews,
    postPatientReview,
    specialitydoctor,
    specialitydoctorbyid,
    uploadPatientMedicalFile,
} from "../services/patient";

export function useGetSpecialties() {
    return useQuery({
        queryKey: ["specialties"],
        queryFn: () => getspecialties(),
    });
}

export function useGetSpecialtiesById(id) {
    return useQuery({
        queryKey: ["specialties", id],
        queryFn: () => getspecialtiesById(id),
        enabled: Boolean(id),
    });
}

/** GET /patient/specialties/overview */
export function useGetSpecialtiesOverview() {
    return useQuery({
        queryKey: ["specialties-overview"],
        queryFn: () => specialitydoctor(),
    });
}

/** GET /patient/specialties/overview/:id — specialty details + doctors */
export function useGetSpecialtyOverviewById(id) {
    return useQuery({
        queryKey: ["specialties-overview", id],
        queryFn: () => specialitydoctorbyid(id),
        enabled: Boolean(id),
    });
}

export function useGetAppointments() {
    return useQuery({
        queryKey: ["appointments"],
        queryFn: () => getappointments(),
    });
}

export function useGetMyDoctors() {
    return useQuery({
        queryKey: ["my-doctors"],
        queryFn: () => getmydoctors(),
    });
}

/** POST /patient/book with body: { doctorId, day, hour } */
export function useAddAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addappointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["my-doctors"] });
            queryClient.invalidateQueries({ queryKey: ["specialties-overview"] });
        },
    });
}

/** DELETE /patient/appointments/:id/cancel */
export function useCancelAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => cancelappointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
    });
}

const DEFAULT_PAGE_SIZE = 10;

export function useGetPatientReviews(page = 1, limit = DEFAULT_PAGE_SIZE) {
    return useQuery({
        queryKey: ["patient-reviews", page, limit],
        queryFn: () => getPatientReviews({ page, limit }),
    });
}

export function usePostPatientReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postPatientReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patient-reviews"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
    });
}

export function useGetPatientMedicalFiles(page = 1, limit = DEFAULT_PAGE_SIZE) {
    return useQuery({
        queryKey: ["patient-medical-files", page, limit],
        queryFn: () => getPatientMedicalFiles({ page, limit }),
    });
}

export function useUploadPatientMedicalFile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadPatientMedicalFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patient-medical-files"], exact: false });
        },
    });
}
