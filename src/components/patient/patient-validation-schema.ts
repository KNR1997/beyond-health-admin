import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const patientValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  // last_name: yup.string().required('form:error-last-name-required'),
  // mobile_number: yup.string().max(19, 'maximum 19 digit').optional(),
  mobile_number: yup
    .string()
    .required('form:error-contact-number-required')
    .max(19, 'maximum 19 digit'),
  // email: yup
  //   .string()
  //   .email('form:error-email-format')
  //   .required('form:error-email-required'),
  gender: yup.object().required('form:error-gender-required'),
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
