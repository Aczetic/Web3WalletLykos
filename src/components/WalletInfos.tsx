import React, { useContext } from "react";

import { WalletContext } from "../App";

const WalletInfos = () => {
  const walletInfo = useContext(WalletContext);
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      {walletInfo?.map((each, index) => (
        <div
          key={index}
          className="w-full rounded-sm flex flex-col sm:flex-row items-center gap-2 p-1 bg-blue-300"
        >
          <div className="px-2 w-fit text-blue-900  font-bold tracking-tighter">
            {`Account ${index + 1} : `}
          </div>
          <div className="flex flex-col w-full sm:w-fit items-start gap-5 sm:flex-row grow-1 ">
            <div className="text-blue-800 w-fit flex gap-1 break-all whitespace-normal">
              <span className="font-bold min-w-18">Address:</span>
              {each.address}
            </div>
            <div className="text-blue-800 flex gap-1">
              <span className="font-bold min-w-18">Balance:</span>
              {each.balance} ETH
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletInfos;
