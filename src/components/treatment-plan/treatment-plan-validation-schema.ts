import * as yup from 'yup';

export const treatmentPlanValidationSchema = yup.object().shape({
   patient: yup.object().nullable().required('form:error-patient-required'),
   dentist: yup.object().required('form:error-doctor-required')
});
