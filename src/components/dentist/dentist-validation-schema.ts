import * as yup from 'yup';

export const dentistValidationSchema = yup.object().shape({
  first_name: yup.string().required('form:error-first-name-required'),
  last_name: yup.string().required('form:error-last-name-required'),
  mobile_number: yup
    .string()
    .required('form:error-contact-number-required')
    .max(19, 'maximum 19 digit'),
  license_number: yup.string().required('form:error-license-number-required'),
  specialization: yup.object().required('form:error-specification-required'),
});
