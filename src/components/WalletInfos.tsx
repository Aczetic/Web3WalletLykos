import { useContext } from "react";
import { Wallet } from "../App";
import { WalletContext } from "../App";

const WalletInfos = () => {
  const walletInfo: Wallet[] = useContext(WalletContext) || [];
  return (
    <div className="w-full max-w-[600px] flex flex-col items-center justify-center gap-2">
      {walletInfo.map((each, index) => (
        <div
          key={index}
          className="w-full rounded-sm flex flex-col items-center gap-2 p-1 bg-blue-300"
        >
          <div className="px-2 w-fit text-blue-900  font-bold tracking-tighter">
            {`Account ${index + 1} : `}
          </div>
          <div className="flex flex-col self-start w-full sm:w-fit items-start gap-2 grow-1 ">
            <div className="text-blue-800 w-fit flex gap-1 break-all whitespace-normal">
              <span className="font-bold min-w-18">Address:</span>
              {each.address}
            </div>
            <div className="text-blue-800 flex gap-1">
              <span className="font-bold min-w-18">Balance:</span>
              {each.balance} ETH
            </div>
            <div className="text-blue-800 flex gap-1">
              <span className="font-bold min-w-18">DAI:</span>
              {each.dai}
            </div>
            <div className="text-blue-800 flex gap-1 break-all ">
              <span className="font-bold min-w-22">ENS Name:</span>
              {each.ensName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletInfos;
