import { PatientTreatment, PatientTreatmentInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const patientTreatmentClient = {
  create: (input: PatientTreatmentInput) => {
    return HttpClient.post(API_ENDPOINTS.PATIENT_Treatments, input);
  },

  update: (input: PatientTreatmentInput) => {
    return HttpClient.put(API_ENDPOINTS.PATIENT_Treatments, input);
  },

  all: (patientId: string) => {
    return HttpClient.get<PatientTreatment[]>(
      `${API_ENDPOINTS.PATIENTS}/${patientId}/treatments/`,
    );
  },
};
