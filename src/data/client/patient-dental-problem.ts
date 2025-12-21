import { PatientDentalProblem, PatientDentalProblemInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const patientDentalProblemClient = {
  create: (input: PatientDentalProblemInput) => {
    return HttpClient.post(API_ENDPOINTS.PATIENT_DENTAL_PROBLEMS, input);
  },

  update: (input: PatientDentalProblemInput) => {
    return HttpClient.put(API_ENDPOINTS.PATIENT_DENTAL_PROBLEMS, input);
  },

  all: (patientId: string) => {
    return HttpClient.get<PatientDentalProblem[]>(
      `${API_ENDPOINTS.PATIENTS}/${patientId}/dental-problems/`,
    );
  },
};
