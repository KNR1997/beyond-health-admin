import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const userValidationSchema = yup.object().shape({
  name: yup
  .string()
  .required('form:error-name-required')
  .matches(
    /^[a-zA-Z\s]+$/,
    'Name must only contain letters and spaces'
  ),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email must be in a valid format'
    ),
  password: yup
    .string()
    .required('form:error-password-required')
    .matches(passwordRules, {
      message:
        'Please create a stronger password. hint: Min 8 characters, 1 Upper case letter, 1 Lower case letter, 1 Numeric digit.',
    }),
});
