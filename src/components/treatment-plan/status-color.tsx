const StatusColor = (status: string) => {
  let bg_class = '';
  if (status?.toLowerCase() === 'proposed') {
    bg_class = 'bg-status-pending bg-opacity-10 text-status-pending';
  } else if (status?.toLowerCase() === 'accepted') {
    bg_class = 'bg-status-processing bg-opacity-10 text-status-processing';
  } else if (status?.toLowerCase() === 'in_progress') {
    bg_class = 'bg-status-processing bg-opacity-10 text-status-processing';
  } else if (status?.toLowerCase() === 'completed') {
    bg_class = 'bg-status-canceled bg-opacity-10 text-status-canceled';
  } else if (status?.toLowerCase() === 'cancelled') {
    bg_class = 'bg-status-canceled bg-opacity-10 text-status-canceled';
  }
  return bg_class;
};

export default StatusColor;
