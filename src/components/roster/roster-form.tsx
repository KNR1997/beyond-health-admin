import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import { getErrorMessage } from '@/utils/form-error';
// form validation
import { rosterValidationSchema } from './roster-validation-schema';
// hooks
import { useSettingsQuery } from '@/data/settings';
import {
  useCreateRosterMutation,
  useUpdateRosterMutation,
} from '@/data/roster-week';
// components
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import SelectInput from '@/components/ui/select-input';
import DatePicker from '@/components/ui/date-picker';
import Description from '@/components/ui/description';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type FormValues = {
  week_start_date: Date | string;
  week_end_date: Date | string;
  status: { label: string; value: string };
};

const defaultValues = {
  week_start_date: null,
  week_end_date: null,
};

const statusOptions = [
  {
    label: 'Draft',
    value: 'DRAFT',
  },
  {
    label: 'Published',
    value: 'PUBLISHED',
  },
  {
    label: 'Locked',
    value: 'LOCKED',
  },
];

type IProps = {
  initialValues?: any;
};
export default function CreateOrUpdateRosterForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const today = new Date();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,

    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(rosterValidationSchema),
  });

  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const { mutate: createRoster, isLoading: creating } =
    useCreateRosterMutation();
  const { mutate: updateRoster, isLoading: updating } =
    useUpdateRosterMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      week_start_date: format(new Date(values.week_start_date), 'yyyy-MM-dd'),
      week_end_date: format(new Date(values.week_end_date), 'yyyy-MM-dd'),
      status: values.status.value,
    };

    try {
      if (
        !initialValues
      ) {
        createRoster({
          ...input,
        });
      } else {
        updateRoster({
          ...input,
          id: initialValues.id!,
        });
      }
    } catch (err) {
      getErrorMessage(err);
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
          } ${t('form:roster-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <DatePicker
            required={true}
            control={control}
            name="week_start_date"
            minDate={today}
            // startDate={new Date(startDate)}
            placeholder="End Date"
            // toolTipText={t('form:input-tooltip-maintenance-end-time')}
            label={t('form:input-label-week-start-date')}
            error={t(errors.week_start_date?.message!)}
            dateFormat="yyyy MMMM d"
          />
          <DatePicker
            required={true}
            control={control}
            name="week_end_date"
            // disabled={!startDate || !isMaintenanceMode}
            // minDate={addDays(new Date(startDate), 0)}
            placeholder="End Date"
            // toolTipText={t('form:input-tooltip-maintenance-end-time')}
            label={t('form:input-label-week-end-date')}
            error={t(errors.week_end_date?.message!)}
            dateFormat="yyyy MMMM d"
          />

          <div className="mb-5">
                  <SelectInput
                    label={t('form:input-label-status')}
                    name="status"
                    control={control}
                    options={statusOptions}
                    isClearable={true}
                  />
          </div>
        </Card>
      </div>
       
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-roster')
              : t('form:button-label-add-roster')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
