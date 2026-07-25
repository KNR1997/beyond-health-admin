import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { CalendarIcon } from '../icons/calendar';

// Add this component before the Description section
function RosterWeekInfo({ rosterWeekId }: { rosterWeekId: string }) {
  const { t } = useTranslation();
  // You'll need to fetch the roster week data here
  // const { rosterWeek } = useRosterWeekQuery(rosterWeekId);

  // Example data - replace with actual query
  const startDate = new Date('2026-07-20');
  const endDate = new Date('2026-07-26');

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 text-blue-800">
        <CalendarIcon className="w-5 h-5" />
        <span className="font-semibold">
          {t('form:roster-week-label') || 'Roster Week'}
        </span>
      </div>
      <div className="mt-2 text-sm text-blue-700">
        <span>
          {format(startDate, 'MMMM d, yyyy')} —{' '}
          {format(endDate, 'MMMM d, yyyy')}
        </span>
        <span className="ml-4 text-xs text-blue-500">
          ({format(startDate, 'EEE')} - {format(endDate, 'EEE')})
        </span>
      </div>
    </div>
  );
}
