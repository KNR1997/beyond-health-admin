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

const DentistLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-8 rounded-lg bg-light p-5 md:p-8">
        <div className="mb-7 flex items-center justify-between">
          <PageHeading title={t('text-summary')} />
        </div>
                <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="sticker-card-title-rev"
            // subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#047857"
            price={12}
          />
          <StickerCard
            titleTransKey="sticker-card-title-today-refunds"
            // subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-8 w-8" />}
            color="#865DFF"
            price={12}
          />
          <StickerCard
            titleTransKey="sticker-card-title-total-shops"
            icon={<BasketIcon className="h-8 w-8" />}
            color="#E157A0"
            price={12}
          />
          <StickerCard
            titleTransKey="sticker-card-title-today-rev"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            price={12}
          />
        </div>
      </div>
    </>
  );
};

const DentistDashboard = () => {
  return <DentistLayout />;
};

export default DentistDashboard;
