import * as yup from 'yup';

export const treatmentValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
});
