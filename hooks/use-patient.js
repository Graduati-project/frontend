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
    specialitydoctor,
    specialitydoctorbyid,
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
