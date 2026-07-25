import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const dentistValidationSchema = yup.object().shape({
  first_name: yup.
  string()
  .required('form:error-first-name-required')
  .matches(
    /^[a-zA-Z\s]+$/,
    'First name must only contain letters and spaces'
  ),
  last_name: yup
  .string()
  .required('form:error-last-name-required')
  .matches(
    /^[a-zA-Z\s]+$/,
    'Last name must only contain letters and spaces'
  ),
  mobile_number: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('form:error-contact-number-required'),
  license_number: yup
  .string()
  .required('form:error-license-number-required')
  .matches(
    /^[a-zA-Z0-9]+$/,
    'License number must only contain letters and numbers'
  ),
  specialization: yup.object().required('form:error-specification-required'),
  password: yup
    .string()
    .required('Password is Required')
    .matches(passwordRules, {
      message:
        'Please create a stronger password. hint: Min 8 characters, 1 Upper case letter, 1 Lower case letter, 1 Numeric digit.',
    }),
});
