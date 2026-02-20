import * as yup from 'yup';

export const patientValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  // last_name: yup.string().required('form:error-last-name-required'),
  dob: yup
    .date()
    .typeError('form:error-dob-must-date')
    .required('form:error-dob-required'),
  mobile_number: yup
    .string()
    .required('form:error-contact-number-required')
    .max(19, 'maximum 19 digit'),
  nic: yup
    .string()
    .required('form:error-nic-required')
    .matches(
      /^(\d{9}[vV]|\d{12})$/,
      "NIC number must be in the format 123456789V or 200012345678"
    ),
  gender: yup.object().required('form:error-gender-required'),
});
