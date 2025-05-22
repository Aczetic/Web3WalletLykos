import { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationParent from "./components/NotificationParent";
import { NotificationType, NotificationT } from "./components/Notification";
import "./App.css";

type Wallet = {
  balance: number;
  address: string;
};

function App() {
  const [walletInfo, setWalletInfo] = useState<Wallet | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); //TODO: set this so it sets automatically on the user preference misc
  const [notifications, setNotifications] = useState<NotificationT[]>([]);

  const notify = (notification: NotificationT) => {
    // I am putting up the state for notifications here as setting up constext/ pub-sub , etc is not the scope of the problem but still wanted to have a notification system
    setNotifications((current: NotificationT[]) => [...current, notification]);
  };

  useEffect(() => {
    notify({
      message: "ths is a notification message",
      type: NotificationType.error,
    });
  }, []);

  return (
    <>
      <div className="parent bg-white dark:bg-zinc-800 w-full max-w-[1280px] box-border h-[100vh] flex flex-col items-center justify-center relative px-4">
        {
          <NotificationParent
            notifications={notifications}
            setNotifications={setNotifications}
          />
        }
        <div
          className="absolute w-2 h-2 right-10 top-2 select-none cursor-pointer "
          onClick={() => {
            document.body.classList.toggle("dark"), setIsDarkMode(!isDarkMode);
          }}
        >
          {isDarkMode ? (
            <LightModeIcon className="text-white" />
          ) : (
            <DarkModeIcon className="text-zinc-800" />
          )}
        </div>
        {walletInfo ? (
          "Wallet info"
        ) : (
          <div className="bg-blue-800 text-blue-100  px-3 py-1 rounded-sm active:scale-[0.99] duration-100 select-none cursor-pointer">
            Connect Wallet
            {/* TODO:show the button only when the wallet info is not present or when the wallet is not connected */}
          </div>
        )}
        <div></div>
      </div>
    </>
  );
}

export default App;
