import * as yup from 'yup';

export const patientDiseaseValidationSchema = yup.object({
  dentalProblems: yup
    .array()
    .min(1, 'form:error-minimum-one-required')
    .of(
      yup.object({
        dental_problem: yup
          .object({
            label: yup.string().required(),
            value: yup.string().required(),
          })
          .required('form:error-dental-problem-required'),

        severity: yup
          .object({
            label: yup.string().required(),
            value: yup.string().required(),
          })
          .required('form:error-severity-required'),
      }),
    )
    .test(
      'unique-dental-problem',
      'form:error-duplicate-dental-problem',
      function (value) {
        if (!value) return true;

        const seen = new Map<string, number>();

        for (let i = 0; i < value.length; i++) {
          const currentId = value[i]?.dental_problem?.value;
          if (!currentId) continue;

          if (seen.has(currentId)) {
            return this.createError({
              path: `dentalProblems.${i}.dental_problem`,
              message: 'form:error-duplicate-dental-problem',
            });
          }

          seen.set(currentId, i);
        }

        return true;
      },
    )
    .required(),
});
