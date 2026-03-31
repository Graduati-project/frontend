 "use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addStaffDoctor,
  addStaffPatient,
  addStaffUser,
  getStaffAppointments,
  getStaffDoctors,
  getStaffPatientById,
  getStaffPatients,
  getStaffSpecialties,
} from "../services/staff";

export function useGetDoctors() {
  return useQuery({
    queryKey: ["staff-doctors"],
    queryFn: () => getStaffDoctors(),
  });
}

export function useGetPatients() {
  return useQuery({
    queryKey: ["staff-patients"],
    queryFn: () => getStaffPatients(),
  });
}

export function useGetPatientById(id) {
  return useQuery({
    queryKey: ["staff-patients", id],
    queryFn: () => getStaffPatientById(id),
    enabled: Boolean(id),
  });
}

export function useGetStaffAppointments() {
  return useQuery({
    queryKey: ["staff-appointments"],
    queryFn: () => getStaffAppointments(),
  });
}

export function useAddDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStaffDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-doctors"] });
    },
  });
}

export function useAddStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStaffUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-users"] });
    },
  });
}

export function useAddPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStaffPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-patients"] });
    },
  });
}

export function useGetStaffSpecialties() {
  return useQuery({
    queryKey: ["staff-specialties"],
    queryFn: () => getStaffSpecialties(),
  });
}