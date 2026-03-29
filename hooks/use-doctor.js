"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addTreatment,
  getDoctorAppointments,
  getDoctorPatients,
  updateAppointmentStatus,
  updateTreatment,
} from "../services/doctor";

export function useGetDoctorAppointments() {
  return useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => getDoctorAppointments(),
  });
}

export function useGetDoctorPatients() {
  return useQuery({
    queryKey: ["doctor-patients"],
    queryFn: () => getDoctorPatients(),
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    },
  });
}

export function useAddTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-patients"] });
    },
  });
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTreatment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-patients"] });
    },
  });
}
