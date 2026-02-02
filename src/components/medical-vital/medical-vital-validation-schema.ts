import * as yup from 'yup';

export const dentalProblemValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
});
