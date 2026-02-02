import * as yup from 'yup';

export const treatmentPlanItemsValidationSchema = yup.object().shape({
   // patient: yup.object().nullable().required('form:error-patient-required'),
   // treatment: yup.object().required('form:error-doctor-required')
});
