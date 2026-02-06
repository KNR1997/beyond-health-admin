import cn from 'classnames';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { useScrollableSlider } from '@/utils/use-scrollable-slider';
// icons
import { ChevronRight } from '../icons/chevron-right';
import { ChevronLeft } from '../icons/chevron-left';
// components
import Link from '@/components/ui/link';

export default function RosterPageHeader({
  pageTitle,
  rosterWeekId,
}: {
  pageTitle: string;
  rosterWeekId: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider();
  const sanitizedPath = router.asPath.split('#')[0].split('?')[0];
  const childMenu = [
    {
      href: Routes.roster.editWithoutLang(rosterWeekId),
      label: 'text-general-info',
      icon: 'SettingsIcon',
    },
    {
      href: Routes.roster.assignments(rosterWeekId),
      label: 'text-assignments',
      icon: 'RefundsIcon',
    },
  ];

  return (
    <>
      <div className="flex pt-1 pb-5 sm:pb-8">
        <h1 className="text-lg font-semibold text-heading">{t(pageTitle)}</h1>
      </div>
      <div className="relative mb-9 flex items-center overflow-hidden border-b border-border-base/90 lg:mb-12">
        <button
          title="Prev"
          //   ref={sliderPrevBtn}
          //   onClick={() => scrollToTheLeft()}
          className="absolute -top-1 z-10 h-[calc(100%-4px)] w-8 bg-gradient-to-r from-gray-100 via-gray-100 to-transparent px-0 text-gray-500 start-0 hover:text-black 3xl:hidden"
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>
        <div className="flex items-start overflow-hidden">
          <div
            className="custom-scrollbar-none flex w-full items-center gap-6 overflow-x-auto scroll-smooth text-[15px] md:gap-7 lg:gap-10"
            ref={sliderEl}
          >
            {childMenu?.map((item: any, index: number) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "relative shrink-0 pb-3 font-medium text-body before:absolute before:bottom-0 before:h-px before:bg-accent before:content-[''] hover:text-heading",
                  sanitizedPath === item.href
                    ? 'text-heading before:w-full'
                    : null,
                )}
              >
                {t(item.label)}
              </Link>
            ))}
          </div>
        </div>
        <button
          title="Next"
          ref={sliderNextBtn}
          onClick={() => scrollToTheRight()}
          className="absolute -top-1 z-10 flex h-[calc(100%-4px)] w-8 items-center justify-center bg-gradient-to-l from-gray-100 via-gray-100 to-transparent text-gray-500 end-0 hover:text-black 3xl:hidden"
        >
          <ChevronRight className="h-[18px] w-[18px]" />
        </button>
      </div>
    </>
  );
}
