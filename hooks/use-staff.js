 "use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addStaffDoctor,
  addStaffUser,
  getStaffAppointments,
  getStaffDoctors,
  getStaffPatientById,
  getStaffPatients,
} from "../services/staff";

export function useGetDoctors() {
    return useQuery({
        queryKey: ["doctors"],
        queryFn: () => getStaffDoctors(),
    });
}

export function useGetPatients() {
    return useQuery({
        queryKey: ["patients"],
        queryFn: () => getStaffPatients(),
    });
}

export function useGetPatientById(id) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => getStaffPatientById(id),
    enabled: Boolean(id),
  });
}

export function useGetStaffAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: () => getStaffAppointments(),
  });
}

export function useAddDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStaffDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useAddStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStaffUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}