import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

enum NotificationType {
  error = "error",
  success = "success",
  alert = "alert",
}

export type NotificationT = { message: string; type: NotificationType };

export { NotificationType };

const Notification = React.memo(
  ({
    message,
    notType,
    setNotifications,
  }: {
    message: string;
    notType: NotificationType;
    setNotifications: Dispatch<SetStateAction<NotificationT[]>>;
  }) => {
    const ref: { current: HTMLInputElement } = useRef();

    useEffect(() => {
      setTimeout(() => {
        ref.current.classList.remove("translate-y-[-10rem]");
      }, 100); // I have done this because this class will be removed  in the same tick as the rendering of original one so it gets prevented and reapplied

      setTimeout(() => {
        ref.current.classList.add("translate-y-[-10rem]");
      }, 4000);

      setTimeout(() => {
        // this removes the notifications when they are done displaying themselves
        setNotifications((current: NotificationT[]) => [...current.slice(1)]);
      }, 3000);
    }, []);

    return (
      <div
        ref={ref}
        className={`${
          notType == NotificationType.error
            ? "bg-red-200 text-red-900"
            : notType === NotificationType.success
            ? "bg-green-200 text-green-800"
            : "bg-yellow-200 text-yellow-900"
        } px-2 py-1 rounded-sm flex gap-1 absolute duration-500 w-fit top-5 transition-transform translate-y-[-10rem]`}
      >
        {notType == NotificationType.error ? (
          <ErrorIcon />
        ) : notType == NotificationType.success ? (
          <SuccessIcon />
        ) : (
          <InfoIcon />
        )}{" "}
        {message}
      </div>
    );
  }
);

export default Notification;
