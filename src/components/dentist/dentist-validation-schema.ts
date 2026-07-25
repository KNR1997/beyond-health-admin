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
    .required('form:error-contact-number-required')
    .max(19, 'maximum 19 digit'
    // .matches(
    //     /^(?:\+94|0)7[01245678]\d{7}$/,
    //     'Contact number must be in the format +94712345678 or 0712345678'
    //   )
    ),
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
