import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
// types
import { Patient } from '@/types';
// components
import Card from '@/components/common/card';
import Description from '@/components/ui/description';

type IProps = {
  patient: Patient;
};

export default function PatientDetails({ patient }: IProps) {
  const { t } = useTranslation();

  // Format date of birth
  const formatDateOfBirth = (dob: string | Date) => {
    if (!dob) return 'N/A';
    try {
      const date = typeof dob === 'string' ? new Date(dob) : dob;
      return format(date, 'MMMM d, yyyy');
    } catch {
      return 'N/A';
    }
  };

  // Get gender label
  const getGenderLabel = (gender: string) => {
    const genderMap: Record<string, string> = {
      M: 'Male',
      F: 'Female',
    };
    return genderMap[gender] || gender || 'N/A';
  };

  // Get full name (handles both user object and direct name)
  const getPatientName = () => {
    if (patient.user) {
      // If user object is populated
      return (
        `${patient.user.first_name} ${patient.user.last_name}`.trim() || 'N/A'
      );
    }
    return patient.name || 'N/A';
  };

  // Get email (handles both user object and direct email)
  const getPatientEmail = () => {
    if (patient.user) {
      return patient.user.email || 'N/A';
    }
    return patient.email || 'N/A';
  };

  // Get mobile number (handles both user object and direct mobile_number)
  const getPatientMobile = () => {
    if (patient.user) {
      return patient.user.mobile_number || 'N/A';
    }
    return patient.mobile_number || 'N/A';
  };

  // Get NIC
  const getPatientNIC = () => {
    if (patient.user) {
      return patient.user.nic || 'N/A';
    }
    return patient.nic || 'N/A';
  };

  // Get gender (handles both user object and direct gender)
  const getPatientGender = () => {
    const gender = patient.user ? patient.user.gender : patient.gender;
    return getGenderLabel(gender);
  };

  // Get date of birth (handles both user object and direct dob)
  const getPatientDOB = () => {
    const dob = patient.user ? patient.user.dob : patient.dob;
    return formatDateOfBirth(dob);
  };

  return (
    <div className="flex flex-wrap my-5 sm:my-8">
      <Description
        title={t('form:input-label-description')}
        details="Patient Details"
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        {/* Patient Name */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-name')}
          </h4>
          <p className="text-base text-gray-900">{getPatientName()}</p>
        </div>

        {/* Date of Birth */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-dob')}
          </h4>
          <p className="text-base text-gray-900">{getPatientDOB()}</p>
        </div>

        {/* NIC */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-nic')}
          </h4>
          <p className="text-base text-gray-900">{getPatientNIC()}</p>
        </div>

        {/* Gender */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-select-gender')}
          </h4>
          <p className="text-base">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                getPatientGender() === 'Male'
                  ? 'bg-blue-100 text-blue-800'
                  : getPatientGender() === 'Female'
                    ? 'bg-pink-100 text-pink-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {getPatientGender()}
            </span>
          </p>
        </div>

        {/* Mobile Number */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-contact')}
          </h4>
          <p className="text-base text-gray-900">{getPatientMobile()}</p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            {t('form:input-label-email')}
          </h4>
          <p className="text-base text-gray-900">
            <a
              href={`mailto:${getPatientEmail()}`}
              className="text-blue-600 hover:underline"
            >
              {getPatientEmail()}
            </a>
          </p>
        </div>

        {/* Optional: Show ID and Created Date if needed */}
        {(patient.id || patient.created_at) && (
          <div className="mt-5 pt-5 border-t border-gray-200 space-y-1">
            {patient.id && (
              <p className="text-xs text-gray-400">ID: {patient.id}</p>
            )}
            {patient.created_at && (
              <p className="text-xs text-gray-400">
                Created:{' '}
                {format(new Date(patient.created_at), 'MMMM d, yyyy h:mm aa')}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
