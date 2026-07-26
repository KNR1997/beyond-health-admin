import * as yup from 'yup';

export const treatmentPlanItemsValidationSchema = yup.object().shape({
  items: yup
    .array()
    .of(
      yup.object({
        treatment: yup
          .object()
          .nullable()
          .required('form:error-treatment-required'),

        tooth_number: yup
          .number()
          .typeError('form:error-tooth-number-must-number')
          .required('form:error-tooth-number-required')
          .positive('form:error-tooth-number-must-positive')
          .max(32, 'form:error-tooth-number-must-less-than-32'),

        cost: yup
          .number()
          .typeError('form:error-cost-must-number')
          .required('form:error-cost-required')
          .positive('form:error-cost-must-positive'),
      }),
    )
    .min(1, 'form:error-month-required')
    .required(),
});
