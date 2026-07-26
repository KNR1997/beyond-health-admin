import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
// icons
import { BasketIcon } from '@/components/icons/summary/basket';
import { EaringIcon } from '@/components/icons/summary/earning';
import { ShoppingIcon } from '@/components/icons/summary/shopping';
import { ChecklistIcon } from '@/components/icons/summary/checklist';
// components
import PageHeading from '@/components/common/page-heading';
import StickerCard from '@/components/widgets/sticker-card';
import { useAnalyticsQuery } from '@/data/dashboard';
import usePrice from '@/utils/use-price';
import Loader from '@/components/ui/loader/loader';

const StaffLayout = () => {
  const { t } = useTranslation();
  const { data, isLoading: loading } = useAnalyticsQuery();
  const { price } = usePrice({
    amount: Number(data?.total_revenue?.total_cost),
  });

  if (loading) {
    return <Loader text={t('common:text-loading')} />;
  }
  return (
    <>
      <div className="mb-8 rounded-lg bg-light p-5 md:p-8">
        <div className="mb-7 flex items-center justify-between">
          <PageHeading title={t('text-summary')} />
        </div>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="sticker-card-title-today-patients"
            // subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#047857"
            price={data?.patient_count}
          />
          <StickerCard
            titleTransKey="sticker-card-title-today-appointments"
            // subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-8 w-8" />}
            color="#865DFF"
            price={data?.appointments_by_month?.length}
          />
          <StickerCard
            titleTransKey="sticker-card-title-today-dentists"
            icon={<BasketIcon className="h-8 w-8" />}
            color="#E157A0"
            price={data?.dentist_count}
          />
          {/* <StickerCard
            titleTransKey="sticker-card-title-today-rev"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            price={12}
          /> */}
        </div>
      </div>
    </>
  );
};

const StaffDashboard = () => {
  return <StaffLayout />;
};

export default StaffDashboard;
