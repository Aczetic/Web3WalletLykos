import { createContext, useCallback, useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationParent from "./components/NotificationParent";
import { NotificationT, NotificationType } from "./components/Notification";
import { BrowserProvider, formatEther, ethers } from "ethers";
import "./App.css";
import WalletInfos from "./components/WalletInfos";

export type Wallet = {
  balance: string;
  address: string;
  ensName: string;
  dai: string;
};

export const WalletContext = createContext<Wallet[]>([]);

function App() {
  const [walletInfo, setWalletInfo] = useState<Wallet[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false); //TODO: set this so it sets automatically on the user preference misc
  const [notifications, setNotifications] = useState<NotificationT[]>([]);
  const [walletConnected, setWalletConnected] = useState<boolean | null>(null);

  const notify = (notification: NotificationT) => {
    // I am putting up the state for notifications here as setting up constext/ pub-sub , etc is not the scope of the problem but still wanted to have a notification system
    setNotifications((current: NotificationT[]) => [
      ...current,
      { ...notification, id: crypto.randomUUID() },
    ]);
  };

  const getWalletInfo: (
    provider: BrowserProvider
  ) => Promise<Wallet[]> = async (provider: BrowserProvider) => {
    const addresses = await provider.send("eth_requestAccounts", []);

    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const ERC20_ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
    ];

    const accounts: Wallet[] = [];

    for (let i = 0; i < addresses.length; i++) {
      //  dai fetching starts
      try {
        const ensName = await provider.lookupAddress(addresses[i]); // I am not sure if this works are not I got this DAI token and ens name code from chat gpt

        const dai = new ethers.Contract(DAI_ADDRESS, ERC20_ABI, provider);
        const [balance, decimals, symbol] = await Promise.all([
          dai.balanceOf(addresses[i]),
          dai.decimals(),
          dai.symbol(),
        ]);

        const formattedBalance =
          ethers.formatUnits(balance, decimals) + " " + symbol;

        // Daifetching over
        accounts.push({
          balance: formatEther(await provider.getBalance(addresses[i])),
          address: addresses[i],
          dai: formattedBalance,
          ensName: ensName || addresses[i] + " ( No ENS assigned )",
        });
      } catch (e) {
        console.error(e);
        notify({
          message: "Some error occured",
          type: NotificationType.error,
          id: "",
        });
      }
    }
    return accounts;
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      notify({
        message: "MetaMask extension is not installed",
        type: NotificationType.error,
        id: "",
      });
      return;
    } else {
      try {
        if (walletConnected === false) {
          notify({
            message: "Allow connection on Meta Mask",
            type: NotificationType.alert,
            id: "",
          });
        }
        const provider = new BrowserProvider(window.ethereum);

        getWalletInfo(provider).then((accounts: Wallet[]): void => {
          setWalletInfo([...accounts]);
        });
      } catch (e) {
        notify({
          message: "some error occured",
          type: NotificationType.error,
          id: "",
        });
        console.error(e);
      }
    }
  }, [walletConnected, walletInfo]);

  const updateAccountsInfo = (accounts: Wallet[]) => {
    if (accounts.length === 0) {
      notify({
        message: "Wallet disconnected",
        type: NotificationType.alert,
        id: "",
      });
      setWalletConnected(false);
      setWalletInfo([]);
    } else if (walletConnected === false) {
      connectWallet();
      setWalletConnected(true);

      setTimeout(() => {
        notify({
          message: "Wallet Connected Successfully",
          type: NotificationType.success,
          id: "",
        });
      }, 1000);
    } else {
      notify({
        message: "Accounts Information Changed",
        type: NotificationType.alert,
        id: "",
      });
      connectWallet();
    }
  };

  const networkChanged = () => {
    notify({
      message: "The network information has changed",
      type: NotificationType.alert,
      id: "",
    });
    connectWallet();
  };

  const updateBalance = () => {
    notify({
      message: "A transaction has taken place",
      type: NotificationType.alert,
      id: "",
    });
    connectWallet();
  };

  useEffect(() => {
    // this effect will fetch wallet infor on every launch
    if (!window.ethereum) {
      notify({
        message: "The meta mask extension is not installed",
        type: NotificationType.error,
        id: "",
      });
    } else {
      window.ethereum.on("accountsChanged", updateAccountsInfo); // for accounts info changes
      window.ethereum.on("block", updateBalance); // this I searched and found this event is emitted on transactions not tested
      window.ethereum.on("chainChanged", networkChanged); // for network changed
    }
    return () => {
      if (window.ethereum) {
        //cleanup only when the metamask is present
        window.ethereum.off("accountsChanged", updateAccountsInfo);
        window.ethereum.off("chainChanged", networkChanged);
        window.ethereum.off("block", updateBalance);
      }
    };
  }, [walletInfo, walletConnected]); // here I am refreshing the event listeners because they might hold up old values of variables if not updated

  useEffect(() => {
    if (walletConnected == null) {
      setWalletConnected(() => {
        return window.localStorage.getItem("isWalletConnected") == "true"
          ? true
          : false;
      });
    } else {
      window.localStorage.setItem(
        "isWalletConnected",
        JSON.stringify(walletConnected)
      );
    }
  }, [walletConnected]);

  return (
    <>
      <WalletContext.Provider value={walletInfo}>
        <div className="parent bg-white dark:bg-zinc-800 w-full box-border h-[100vh] flex flex-col items-center justify-center relative px-4">
          {
            <NotificationParent
              notifications={notifications}
              setNotifications={setNotifications}
            />
          }
          <div
            className="absolute w-2 h-2 right-10 top-2 select-none cursor-pointer "
            onClick={() => {
              document.body.classList.toggle("dark"),
                setIsDarkMode(!isDarkMode);
            }}
          >
            {isDarkMode ? (
              <LightModeIcon className="text-white" />
            ) : (
              <DarkModeIcon className="text-zinc-800" />
            )}
          </div>
          {walletInfo.length > 0 && (
            <div className="text-2xl text-blue-950 font-bold dark:text-blue-200">
              Wallets Information
            </div>
          )}
          {walletInfo.length > 0 ? (
            <WalletInfos />
          ) : (
            <div
              onClick={connectWallet}
              className="bg-blue-800 text-blue-100  px-3 py-1 rounded-sm active:scale-[0.99] duration-100 select-none cursor-pointer"
            >
              {walletConnected == false ? "Connect Wallet" : "Show Wallets"}
              {/* TODO:show the button only when the wallet info is not present or when the wallet is not connected */}
            </div>
          )}
        </div>
      </WalletContext.Provider>
    </>
  );
}

export default App;
