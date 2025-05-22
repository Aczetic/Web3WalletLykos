import { useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import "./App.css";

type Wallet = {
  balance: number;
  address: string;
};

function App() {
  const [walletInfo, setWalletInfo] = useState<Wallet | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); //TODO: set this so it sets automatically on the user preference misc

  return (
    <>
      <div className="parent bg-white dark:bg-zinc-800 w-full max-w-[1280px] box-border h-[100vh] flex flex-col items-center justify-center relative px-4">
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
