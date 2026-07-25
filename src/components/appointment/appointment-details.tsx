import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
// types
import { Appointment, AppointmentStatus } from '@/types';
// components
import Card from '@/components/common/card';
import Description from '@/components/ui/description';

type IProps = {
  appointment: Appointment;
};

export default function AppointmentDetails({ appointment }: IProps) {
  const { t } = useTranslation();

  // Format the date for display
  const formattedDate = appointment.appointment_date
    ? format(new Date(appointment.appointment_date), 'MMMM d, yyyy h:mm aa')
    : 'N/A';

  // Get status label
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      SCHEDULED: 'Scheduled',
      CONFIRMED: 'Confirmed',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      NO_SHOW: 'No Show',
    };
    return statusMap[status] || status;
  };

  // Get appointment type label
  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      Checkup: 'Checkup',
      Cleaning: 'Cleaning',
      Filling: 'Filling',
    };
    return typeMap[type] || type;
  };

  // Get patient name
  const getPatientName = () => {
    if (appointment.patient) {
      // If patient object is populated
      return appointment.patient.name || 'N/A';
    }
    return 'N/A';
  };

  // Get dentist name
  const getDentistName = () => {
    if (appointment.dentist) {
      // If dentist object is populated with user
      if (appointment.dentist.user) {
        return `${appointment.dentist.user.first_name} ${appointment.dentist.user.last_name}`;
      }
      return appointment.dentist.name || 'N/A';
    }
    return 'N/A';
  };

  return (
    <div className="flex flex-wrap my-5 sm:my-8">
      <Description
        title={t('form:input-label-description')}
        details="Appointment Details"
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        {/* Patient Information */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-patient')}
          </h4>
          <p className="text-base text-gray-900">{getPatientName()}</p>
        </div>

        {/* Dentist Information */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-dentist')}
          </h4>
          <p className="text-base text-gray-900">{getDentistName()}</p>
        </div>

        {/* Appointment Date & Time */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Appointment Date & Time
          </h4>
          <p className="text-base text-gray-900">{formattedDate}</p>
        </div>

        {/* Appointment Type */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Appointment Type
          </h4>
          <p className="text-base text-gray-900">
            {getTypeLabel(appointment.appointment_type)}
          </p>
        </div>

        {/* Appointment Status */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Appointment Status
          </h4>
          <p className="text-base">
            <span
              className={`inline-flex capitalize rounded-full px-2 py-1 text-xs font-semibold ${
                appointment.status === AppointmentStatus.SCHEDULED
                  ? 'bg-blue-100 text-blue-800'
                  : appointment.status === AppointmentStatus.CONFIRMED
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === AppointmentStatus.IN_PROGRESS
                      ? 'bg-yellow-100 text-yellow-800'
                      : appointment.status === AppointmentStatus.COMPLETED
                        ? 'bg-teal-100 text-teal-800'
                        : appointment.status === AppointmentStatus.CANCELLED
                          ? 'bg-red-100 text-red-800'
                          : appointment.status === AppointmentStatus.NO_SHOW
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gray-100 text-gray-800'
              }`}
            >
              {getStatusLabel(appointment.status)}
            </span>
          </p>
        </div>

        {/* Optional: Show ID if needed */}
        {appointment.id && (
          <div className="mt-5 pt-5 border-t border-gray-200">
            <p className="text-xs text-gray-400">ID: {appointment.id}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
