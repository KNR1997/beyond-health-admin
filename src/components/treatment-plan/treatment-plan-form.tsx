import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { treatmentValidationSchema } from './treatment-plan-validation-schema';
import { Patient, Treatment } from '@/types';
import { animateScroll } from 'react-scroll';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import {
  useCreateTreatmentMutation,
  useUpdateTreatmentMutation,
} from '@/data/treatment';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import Categories from '@/pages/categories';
import { dummy } from 'react-laag/dist/types';

type FormValues = {
  name: string;
  category: { label: string; value: string };
  duration: number;
  cost: number;
  description: string;
};

const defaultValues = {
  name: '',
  description: '',
};

const categoryOptions = [
  {
    label: 'Preventive',
    value: 'preventive',
  },
  {
    label: 'Restorative',
    value: 'restorative',
  },
  {
    label: 'Cosmetic',
    value: 'cosmetic',
  },
  {
    label: 'Orthodontics',
    value: 'ortho',
  },
  {
    label: 'Surgical',
    value: 'surgical',
  },
];

type IProps = {
  initialValues?: Treatment;
};

export default function CreateOrUpdateTreatmentForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues
      ? {
        ...initialValues,
        category: categoryOptions.find(
          (categoryOption) =>
            categoryOption.value == initialValues.category,
        ),
      }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(treatmentValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  const { mutate: createTreatment, isLoading: creating } =
    useCreateTreatmentMutation();
  const { mutate: updateTreatment, isLoading: updating } =
    useUpdateTreatmentMutation();

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    animateScroll.scrollToTop();
  };

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      category: values.category.value,
      duration: values.duration,
      cost: values.cost,
      description: values.description,
    };
    const mutationOptions = { onError: handleMutationError };

    if (!initialValues) {
      createTreatment(input, mutationOptions);
    } else {
      updateTreatment(
        {
          ...input,
          id: initialValues.id!,
        },
        mutationOptions,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${initialValues
            ? t('form:item-description-edit')
            : t('form:item-description-add')
            } ${t('form:treatment-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
            required
          />
          <div className="mb-5">
            <SelectInput
              required
              label={t('form:input-label-select-category')}
              name="category"
              control={control}
              options={categoryOptions}
              isClearable={true}
            />
            <ValidationError message={t(errors.category?.message)} />
          </div>
          <Input
            label={t('form:input-label-duration')}
            {...register('duration')}
            type="number"
            variant="outline"
            className="mb-4"
            error={t(errors.duration?.message!)}
            required
          />
          <Input
            label={t('form:input-label-cost')}
            {...register('cost')}
            type="number"
            variant="outline"
            className="mb-4"
            error={t(errors.cost?.message!)}
            required
          />
          <RichTextEditor
            title={t('form:input-description')}
            control={control}
            name={'description'}
            // error={t(
            //   errors?.page_options?.faqItems?.[index]?.description
            //     ?.message,
            // )}
            editorClassName="mb-0"
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t('form:button-label-update-treatment')
              : t('form:button-label-add-treatment')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
