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
    .required('form:error-contact-number-required')
     .max(19, 'maximum 19 digit')
     .matches(
         /^(?:\+94|0)7[01245678]\d{7}$/,
       'Contact number must be in the format +94712345678 or 0712345678'
     ),

  nic: yup
    .string()
    .required('form:error-nic-required')
    .matches(
      /^(\d{9}[vV]|\d{12})$/,
      "NIC number must be in the format 123456789V or 200012345678"
    ),
  gender: yup.object().required('form:error-gender-required'),
});
