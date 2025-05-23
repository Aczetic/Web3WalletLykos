import React, { createContext, ReactNode, useState, useEffect } from "react";
import { NotificationT, NotificationType } from "../components/Notification";
import { ethers, BrowserProvider, formatEther } from "ethers";

export const walletContext = createContext(null);

type Wallet = {
  balance: number;
  address: string;
}[];

const WalletContext = ({ child }: { child: ReactNode }) => {
  const [walletInfo, setWalletInfo] = useState<Wallet>([]);
  const [notifications, setNotifications] = useState<NotificationT[]>([]);

  const notify = (notification: NotificationT) => {
    // I am putting up the state for notifications here as setting up constext/ pub-sub , etc is not the scope of the problem but still wanted to have a notification system
    setNotifications((current: NotificationT[]) => [...current, notification]);
  };
  const connectWallet = async () => {
    if (!window.ethereum) {
      notify({
        message: "MetaMask extension is not installed",
        type: NotificationType.error,
      });
      return;
    } else {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const bal = await provider.getBalance(address);

        console.log(address);
        console.log(formatEther(bal));
      } catch (e) {
        notify({ message: "some error occured", type: NotificationType.error });
        console.error(e);
      }
    }
  };
  const updateAccountsInfo = () =>
    notify({
      message: "update the accounts information",
      type: NotificationType.alert,
    });
  const updateBalance = () =>
    notify({
      message:
        "the chain id has changed which means some transaction has happened",
      type: NotificationType.alert,
    });

  useEffect(() => {
    // this effect will fetch wallet infor on every launch
    if (!window.ethereum) {
      notify({
        message: "The meta mask extension is not installed",
        type: NotificationType.error,
      });
    } else {
      window.ethereum.on("accountsChanged", updateAccountsInfo);

      window.ethereum.on("chainChanged", updateBalance);
    }
    return () => {
      window.ethereum.off("accountsChanged", updateAccountsInfo);
      window.ethereum.off("chainChanged", updateBalance);
    };
  }, []);

  return (
    <walletContext.Provider value={{ notifications, setNotifications }}>
      {child}
    </walletContext.Provider>
  );
};

export default WalletContext;
