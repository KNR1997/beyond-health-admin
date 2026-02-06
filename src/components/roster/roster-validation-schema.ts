import * as yup from 'yup';

export const rosterValidationSchema = yup.object().shape({
  week_start_date: yup.string().required('form:error-week-start-date-required'),
  week_end_date: yup.string().required('form:error-week-end-date-required'),
});
