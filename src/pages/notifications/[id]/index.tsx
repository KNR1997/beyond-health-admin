import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// hooks
import { useNoticationQuery } from '@/data/notification';
// components
import Link from '@/components/ui/link';
import Layout from '@/components/layouts/dentist';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import { IosArrowLeft } from '@/components/icons/ios-arrow-left';
import { adminOnly, dentistOnly } from '@/utils/auth-utils';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const NotificationPage = () => {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    notification: data,
    loading,
    error,
  } = useNoticationQuery({
    id: query?.id as string
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  let classes = {
    title: 'font-semibold',
    content: 'text-sm font-normal text-[#212121]',
  };

  return (
    <div className="px-8 py-10 bg-white rounded shadow">
      <div className="mb-5">
        <Link
          href={`${Routes?.dashboard}?tab=2`}
          className="flex items-center font-bold no-underline transition-colors duration-200 text-accent ms-1 hover:text-accent-hover hover:underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          <IosArrowLeft height={12} width={15} className="mr-2.5" />
          {t('common:text-back-to-home')}
        </Link>
      </div>
      <h3 className="mb-6 text-[22px] font-bold">{data?.notification?.title}</h3>

      <p className="mb-6 text-[15px] leading-[1.75em] text-[#5A5A5A]">
        {data?.notification?.message}
      </p>

      {/* <ul className={`space-y-3.5 ${classes?.content}`}>
        <li>
          <strong className={classes?.title}>
            {t('notice-active-date')}:{' '}
          </strong>
          {dayjs(data?.effective_from).format('DD MMM YYYY')}
        </li>
        <li>
          <strong className={classes?.title}>
            {t('notice-expire-date')}:{' '}
          </strong>
          {dayjs(data?.expired_at).format('DD MMM YYYY')}
        </li>
        <li>
          <strong className={classes?.title}>{t('notice-created-by')}: </strong>
          {data?.creator_role}
        </li>
      </ul> */}
    </div>
  );
};

NotificationPage.authenticate = {
  permissions: dentistOnly,
};
NotificationPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default NotificationPage;
