import { SetStateAction, Dispatch } from "react";
import Notification, { NotificationT } from "./Notification";

const NotificationParent = ({
  notifications,
  setNotifications,
}: {
  notifications: NotificationT[];
  setNotifications: Dispatch<SetStateAction<NotificationT[]>>;
}) => {
  return (
    <div className="w-full bg-red-800 absolute top-0 flex justify-center">
      {notifications.map((each) => (
        <Notification
          key={each.id}
          message={each.message}
          notType={each.type}
          setNotifications={setNotifications}
        />
      ))}
    </div>
  );
};

export default NotificationParent;
