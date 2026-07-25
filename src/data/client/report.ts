import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const reportClient = {
  patientRegistrationReportDownload: () => {
    return HttpClient.download(
      `${API_ENDPOINTS.REPORTS}/patient-registration/`,
    );
  },
  dentistReportDownload: () => {
    return HttpClient.download(`${API_ENDPOINTS.REPORTS}/dentist/`);
  },
  treatmentReportDownload: () => {
    return HttpClient.download(`${API_ENDPOINTS.REPORTS}/treatment/`);
  },
  dentalProblemReportDownload: () => {
    return HttpClient.download(`${API_ENDPOINTS.REPORTS}/dental-problem/`);
  },
  appointmentReportDownload: () => {
    return HttpClient.download(`${API_ENDPOINTS.REPORTS}/appointment/`);
  },
  treatmentPlanReportDownload: () => {
    return HttpClient.download(`${API_ENDPOINTS.REPORTS}/treatment-plan/`);
  },
  rosterReportDownload: ({ rosterWeekId }: { rosterWeekId: string }) => {
    return HttpClient.download(
      `${API_ENDPOINTS.REPORTS}/roster/${rosterWeekId}`,
    );
  },
};
