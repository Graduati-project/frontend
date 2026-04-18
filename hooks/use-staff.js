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
  getStaffPressureReports,
  getStaffReviews,
  getStaffMedicalFiles,
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

export function useGetStaffPressureReports() {
  return useQuery({
    queryKey: ["staff-reports-pressure"],
    queryFn: () => getStaffPressureReports(),
  });
}

const STAFF_TABLE_PAGE_SIZE = 8;

export function useGetStaffReviews(page = 1, limit = STAFF_TABLE_PAGE_SIZE) {
  return useQuery({
    queryKey: ["staff-reviews", page, limit],
    queryFn: () => getStaffReviews({ page, limit }),
  });
}

export function useGetStaffMedicalFiles(
  page = 1,
  limit = STAFF_TABLE_PAGE_SIZE,
  extraParams = {}
) {
  return useQuery({
    queryKey: ["staff-medical-files", page, limit, extraParams.patientId ?? null],
    queryFn: () => getStaffMedicalFiles({ page, limit, ...extraParams }),
  });
}