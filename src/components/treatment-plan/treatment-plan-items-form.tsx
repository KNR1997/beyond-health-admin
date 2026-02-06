import { useState } from 'react';
import { useRouter } from 'next/router';
import { animateScroll } from 'react-scroll';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
// form-validations
import { treatmentPlanItemsValidationSchema } from './treatment-plan-items-validation-schema';
// types
import { Treatment, TreatmentPlanItem } from '@/types';
// hooks
import {
  useCreateTreatmentPlanItemsMutation,
  useUpdateTreatmentPlanItemsMutation,
} from '@/data/treatment-plan';
import { useTreatmentsQuery } from '@/data/treatment';
// components
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

interface TreatmentPlanItemCustom
  extends Omit<TreatmentPlanItem, 'id' | 'treatment'> {
  db_id: string;
  cost: string;
  id: string | null;
  treatment: Treatment | null;
}

type FormValues = {
  items: TreatmentPlanItemCustom[];
};

const defaultValues = {
  items: [],
};

type IProps = {
  treatmentPlanId: string;
  initialValues?: TreatmentPlanItem[];
};

export default function CreateOrUpdateTreatmenPlanItemsForm({
  treatmentPlanId,
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [removedPlanItemIds, setRemovedPlanItemIds] = useState<string[]>([]);

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
          items: initialValues.map((item) => ({
            db_id: item.id,
            treatment: item.treatment,
            tooth_number: item.tooth_number,
            cost: item.cost,
            notes: item.notes,
          })),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(treatmentPlanItemsValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { treatments, loading: treatmentsLoading } = useTreatmentsQuery({});
  const { mutate: createTreatmentPlanItems, isLoading: creating } =
    useCreateTreatmentPlanItemsMutation();
  const { mutate: updateTreatmentPlanItems, isLoading: updating } =
    useUpdateTreatmentPlanItemsMutation();

  const handleRemovePlanItem = (index: number) => {
    const removedItem = fields[index];
    if (removedItem?.db_id) {
      let removeId = removedItem.db_id;
      setRemovedPlanItemIds((prev) => [...prev, removeId]);
    }
    remove(index);
  };

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
      treatment_plan_id: treatmentPlanId,
      items: values.items.map((item) => ({
        id: item.db_id == "" ? null : item.db_id,
        treatment_id: item?.treatment?.id,
        tooth_number: item.tooth_number,
        cost: item.cost,
        notes: item.notes,
      })),
      deleted_item_ids: removedPlanItemIds,
    };

    const mutationOptions = { onError: handleMutationError };

    if (!initialValues) {
      createTreatmentPlanItems(input, mutationOptions);
    } else {
      updateTreatmentPlanItems(input, mutationOptions);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:treatment-plan-items-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            {fields.map((item: any & { id: string }, index: number) => (
              <div
                className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-0 md:py-8"
                key={item.id}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                  <div className="grid grid-cols-1 gap-5 sm:col-span-4">
                    <Input
                      {...register(`items.${index}.db_id` as const)}
                      className="hidden"
                    />
                    <div>
                      <SelectInput
                        label={t('form:input-label-treatment')}
                        control={control}
                        name={`items.${index}.treatment` as const}
                        // @ts-ignore
                        getOptionLabel={(option: Treatment) => `${option.name}`}
                        // @ts-ignore
                        getOptionValue={(option: Treatment) => option.id}
                        options={treatments}
                        isLoading={treatmentsLoading}
                        required
                      />
                      <ValidationError
                        message={t(errors?.items?.[index]?.treatment?.message)}
                      />
                    </div>
                    <Input
                      label={t('form:input-tooth-number')}
                      toolTipText={t('form:input-tooltip-shop-title')}
                      variant="outline"
                      {...register(`items.${index}.tooth_number` as const)}
                      defaultValue={item?.title!} // make sure to set up defaultValue
                      error={t(errors?.items?.[index]?.tooth_number?.message)}
                    />
                    <Input
                      label={t('form:input-cost')}
                      toolTipText={t('form:input-tooltip-shop-title')}
                      variant="outline"
                      {...register(`items.${index}.cost` as const)}
                      defaultValue={item?.title!} // make sure to set up defaultValue
                      error={t(errors?.items?.[index]?.cost?.message)}
                    />
                    <TextArea
                      label={t('form:input-note')}
                      toolTipText={t('form:input-tooltip-shop-description')}
                      variant="outline"
                      {...register(`items.${index}.notes` as const)}
                      defaultValue={item.description!} // make sure to set up defaultValue
                    />
                  </div>

                  <button
                    onClick={() => handleRemovePlanItem(index)}
                    type="button"
                    className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                  >
                    {t('form:button-label-remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={() =>
              append({
                id: null,
                db_id: '',
                treatment: null,
                tooth_number: '',
                cost: '',
                notes: '',
              })
            }
            className="w-full sm:w-auto"
          >
            {t('form:button-label-add-item')}
          </Button>
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
              ? t('form:button-label-update-treatment-plan')
              : t('form:button-label-add-treatment-plan')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
