import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const dentistValidationSchema = yup.object().shape({
  first_name: yup.string().required('form:error-first-name-required'),
  last_name: yup.string().required('form:error-last-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('Email is required'),
  mobile_number: yup
    .string()
    .required('form:error-contact-number-required')
    .max(19, 'maximum 19 digit'),
  license_number: yup.string().required('form:error-license-number-required'),
  specialization: yup.object().required('form:error-specification-required'),
  password: yup
    .string()
    .required('Password is Required')
    .matches(passwordRules, {
      message:
        'Please create a stronger password. hint: Min 8 characters, 1 Upper case letter, 1 Lower case letter, 1 Numeric digit.',
    }),
});
