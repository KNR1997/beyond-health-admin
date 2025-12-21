import { useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { DentalProblem, PatientDentalProblem, ShopSocialInput } from '@/types';
import { animateScroll } from 'react-scroll';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SelectInput from '@/components/ui/select-input';
import Alert from '@/components/ui/alert';
import Card from '@/components/common/card';
import { useDentalProblemsQuery } from '@/data/dental-problem';
import { useCreatePatientDentalProblemMutation } from '@/data/patient-dental-problem';
import { useState } from 'react';
import Input from '@/components/ui/input';
import { patientDiseaseValidationSchema } from './patient-disease-validation-schema';
import { yupResolver } from '@hookform/resolvers/yup';

type PatientDentalProblemInput = {
  id: string | null;
  dental_problem: { label: string; value: string } | null;
  severity: { label: string; value: string } | null;
};

type FormValues = {
  dentalProblems?: PatientDentalProblemInput[];
};

const defaultValues = {};

type IProps = {
  initialValues?: PatientDentalProblem[];
  patientId: string;
};
export default function CreateOrUpdatePatientDiseaseForm({
  initialValues,
  patientId,
}: IProps) {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { dentalProblems } = useDentalProblemsQuery({});

  const severityOptions = [
    {
      label: 'Mild',
      value: 'mild',
    },
    {
      label: 'Moderate',
      value: 'moderate',
    },
    {
      label: 'Severe',
      value: 'severe',
    },
  ];

  const {
    control,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues
      ? {
          dentalProblems: initialValues.map((dentalProblem) => ({
            id: dentalProblem.id,
            dental_problem: {
              label: dentalProblem.problem.name,
              value: dentalProblem.problem.id,
            },
            severity: {
              label: severityOptions.find(
                (severityOption) =>
                  severityOption.value == dentalProblem.severity,
              )?.label,
              value: dentalProblem.severity,
            },
          })),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(patientDiseaseValidationSchema),
  });

  const { mutate: createPatientDentalProblem, isLoading: creating } =
    useCreatePatientDentalProblemMutation();

  const handleMutationError = (error: any) => {
    console.log('error----: ', error);
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    animateScroll.scrollToTop();
  };

  const {
    fields: socialFields,
    append: socialAppend,
    remove: socialRemove,
  } = useFieldArray({
    control,
    name: 'dentalProblems',
  });

  const onSubmit = async (values: FormValues) => {
    if (!values?.dentalProblems) return;

    const input = {
      patient: patientId,
      problems: values?.dentalProblems?.map((dentalProblem) => ({
        id: dentalProblem.id,
        problem: dentalProblem.dental_problem
          ? dentalProblem.dental_problem.value
          : '',
        severity: dentalProblem.severity ? dentalProblem.severity.value : '',
        // notes: dentalProblem.notes,
      })),
    };
    const mutationOptions = { onError: handleMutationError };
    createPatientDentalProblem(input, mutationOptions);
  };

  return (
    <>
      {errorMessage ? (
        <Alert
          message={errorMessage}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${t('form:item-description-add')} ${t('form:patient-diseases-form-info-help-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div>
              {socialFields?.map(
                (item: ShopSocialInput & { id: string }, index: number) => (
                  <div className="py-5" key={item.id}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                      <div className="sm:col-span-2">
                        <Input
                          name={`dentalProblems.${index}.id` as const}
                          className="hidden"
                        />
                        <SelectInput
                          name={
                            `dentalProblems.${index}.dental_problem` as const
                          }
                          control={control}
                          options={dentalProblems.map(
                            (dentalProblem: DentalProblem) => ({
                              label: dentalProblem.name,
                              value: dentalProblem.id,
                            }),
                          )}
                          isClearable={true}
                          label={t('form:input-label-select-dental-problem')}
                          error={t(
                            errors?.dentalProblems?.[index]?.dental_problem
                              ?.message,
                          )}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <SelectInput
                          name={`dentalProblems.${index}.severity` as const}
                          control={control}
                          options={severityOptions}
                          isClearable={true}
                          label={t('form:input-label-select-severity')}
                          error={t(
                            errors?.dentalProblems?.[index]?.severity?.message,
                          )}
                          required
                        />
                      </div>
                      <button
                        onClick={() => {
                          socialRemove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                        // disabled={isNotDefaultSettingsPage}
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
            <Button
              type="button"
              onClick={() =>
                socialAppend({
                  id: null,
                  dental_problem: null,
                  severity: null,
                })
              }
              className="w-full sm:w-auto"
              // disabled={isNotDefaultSettingsPage}
            >
              {t('form:button-label-add-dental-problem')}
            </Button>
          </Card>
        </div>
        <StickyFooterPanel className="z-0">
          <div className="text-end">
            <Button loading={creating} disabled={creating}>
              {t('form:button-label-update-patient')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
