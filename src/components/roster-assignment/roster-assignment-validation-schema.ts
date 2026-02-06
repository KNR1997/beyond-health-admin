import * as yup from 'yup';

export const rosterValidationSchema = yup.object().shape({
  shift: yup.object().required('form:error-shift-required'),
  dentist: yup.object().required('form:error-dentist-required'),
});
