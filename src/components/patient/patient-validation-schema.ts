import * as yup from 'yup';

export const patientValidationSchema = yup.object().shape({
  name: yup
  .string()
  .required('form:error-name-required')
  .matches(
    /^[a-zA-Z\s]+$/,
    'Name must only contain letters and spaces'
  ),
  // last_name: yup.string().required('form:error-last-name-required'),
  dob: yup
    .date()
    .typeError('form:error-dob-must-date')
    .required('form:error-dob-required'),
  mobile_number: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('form:error-contact-number-required'),
  nic: yup
    .string()
    .required('form:error-nic-required')
    .matches(
      /^(\d{9}[vV]|\d{12})$/,
      "NIC number must be in the format 123456789V or 200012345678"
    ),
  gender: yup.object().required('form:error-gender-required'),
});
