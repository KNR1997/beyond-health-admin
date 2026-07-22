import * as yup from 'yup';

export const appointmentValidationSchema = yup.object().shape({
  patient: yup.object().required('form:error-patient-required'),
  dentist: yup.object().required('form:error-dentist-required'),
  appointment_date: yup.date().required('form:error-date-required'),
  type: yup.object().required('form:error-type-required'),
  status: yup.object().required('form:error-status-required'),
});