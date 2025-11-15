const Notification = ({ message, type = 'error', onClear }) => {
  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      <button className="notification-close" onClick={onClear}>&times;</button>
    </div>
  );
};

export default Notification;