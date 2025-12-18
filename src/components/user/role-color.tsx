const RoleColor = (role: string) => {
  let bg_class = '';
  if (role?.toLowerCase() === 'admin') {
    bg_class = 'bg-status-complete bg-opacity-10 text-status-complete';
  } else if (role?.toLowerCase() === 'patient') {
    bg_class = 'bg-status-canceled bg-opacity-10 text-status-canceled';
  } else {
    bg_class = 'bg-accent bg-opacity-10 !text-accent';
  }

  return bg_class;
};

export default RoleColor;
