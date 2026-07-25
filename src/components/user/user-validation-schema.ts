import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const userValidationSchema = yup.object().shape({
  display_name: yup
    .string()
    .required('form:error-display-name-required')
    .matches(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email must be in a valid format',
    ),
  mobile_number: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('form:error-contact-number-required'),
  password: yup.string().when('$isEditMode', {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required('form:error-password-required'),
  }),
  // password: yup
  //   .string()
  //   .required('form:error-password-required')
  //   .matches(passwordRules, {
  //     message:
  //       'Please create a stronger password. hint: Min 8 characters, 1 Upper case letter, 1 Lower case letter, 1 Numeric digit.',
  //   }),
});
