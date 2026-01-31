import * as yup from 'yup';

export const treatmentPlanValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  category: yup.object().required('form:error-category-required'),
  duration: yup.string().required('form:error-duration-required'),
  cost: yup.string().required('form:error-cost-required'),
});
