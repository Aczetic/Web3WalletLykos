## ⚙️ Approach

The initial idea was pretty simple that is to simply fetch some wallet data like the user's address, balance, ENS name, and DAI token balance, and display it. But in the process (and maybe trying to do a bit too much), I ended up building a **modular notification system** to handle different blockchain events.

### 🛠 What I Did

- **Built a Notification System**  
  Started with the basics, then decided to add a system to show notifications for things like:
  - Wallet/account changes  
  - Network switches  
  - New transactions (listened via new block events)
  - Wallet Connection/Disconnection

- **Handled Events + Cleanup**  
  Used built-in event emitters like `accountsChanged` and `chainChanged`, and for transactions, listened for new blocks.  
  Also made sure to **clean up listeners and timeouts** to avoid issues from leftover event triggers.

- **Kept Things in Sync**  
  Notifications weren’t in sync with app state because the function were holding stale states, so I had to **memoize** a bunch of stuff and manage when things updated so notifications showed up at the right time but still it is not polished.

- **TypeScript **  
  Thought I could get away with ignoring some types (like `ethereum`, `refs`, etc.), but I had eventually go set up the types which was very annoying and time taking. But Ended up learning a lot , though I took help from GPT , stackoverflow as well.

- **ENS + DAI Support**  
  I wanted to show extra info like the ENS name and DAI balance. I asked GPT for help and used `ethers.js` because I didn't wanted to waste time as in the first try of just getting the balance and address.  
  Started with v5 docs and faced lots of errors then took gpt's help and switching to **ethers v6** fixed it.

- **State Management **  
  Thought about using a `reducer`, and even looked into full context-based state management — but ran out of time. Ended up just using React Context to pass wallet info around. Might not be perfect, but it works for now also I could not get my head round the need for context what's the big picture over here so just passed **walletInfo** state.

- **React Hooks & Debugging**  
  Spent a lot of time trying to figure out why things weren’t updating right. Turned out to be problems with stale closures, missing dependencies in `useEffect`, and not memoizing functions correctly and this made me respect dependency array more.

---

### Assumptions

- Assumed the user has an Ethereum wallet MetaMask.
- Notifications are modular and can be extended only notify needs to be called.
- When ENS is not present then show the wallet address

----
### Deployment Link
https://web3-wallet-lykos-solution.vercel.app/
