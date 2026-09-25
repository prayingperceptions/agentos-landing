// wallets.js — human wallet-connect for Agent DEX on BASE (EIP-1193).
// Detection by provider, explicit wallet chooser, Base network switch, and tx sending.
window.DexWallet = (() => {
  const BASE = {
    chainId: '0x2105',                  // 8453
    chainName: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
  };
  const providers = [
    { key: 'rainbow',    name: 'Rainbow',         wallet: () => typeof window.rainbow !== 'undefined' ? window.rainbow : (typeof window.ethereum?.isRainbow !== 'undefined' ? window.ethereum : null), test: () => !!window.rainbow || !!window.ethereum?.isRainbow, icon: '🌈' },
    { key: 'metamask',   name: 'MetaMask',        wallet: () => window.ethereum, test: () => !!window.ethereum?.isMetaMask && !window.ethereum?.isRainbow, icon: '🦊' },
    { key: 'coinbase',   name: 'Coinbase Wallet', wallet: () => window.coinbaseWalletExtension || window.ethereum?.providers?.find(p => p.isCoinbaseWallet) || null, test: () => !!window.coinbaseWalletExtension || !!window.ethereum?.isCoinbaseWallet, icon: '🅱️' },
    { key: 'okx',        name: 'OKX Wallet',      wallet: () => window.okxwallet?.ethereum || null, test: () => !!window.okxwallet?.ethereum, icon: '🟢' },
    { key: 'brave',      name: 'Brave Wallet',    wallet: () => window.ethereum?.isBraveWallet ? window.ethereum : null, test: () => !!window.ethereum?.isBraveWallet, icon: '🦁' },
  ];

  let connected = { address: null, providerKey: null, providerName: null, provider: null, chainId: null };

  function detected() { return providers.filter(p => p.test()).map(p => ({ key: p.key, name: p.name, icon: p.icon })); }

  function walletFor(key) {
    const p = providers.find(x => x.key === key);
    if (!p) return null;
    if (key === 'rainbow') return p.wallet();
    return p.wallet();
  }

  async function requestAccounts(prov) {
    if (!prov || typeof prov.request !== 'function') return { ok: false, error: 'No provider' };
    try {
      const res = await prov.request({ method: 'eth_requestAccounts', params: [] });
      if (res && res.length) return { ok: true, accounts: res };
    } catch (e) { return { ok: false, error: (e && e.message) || 'request denied' }; }
    try {
      const r = await prov.request({ method: 'eth_accounts', params: [] });
      if (r && r.length) return { ok: true, accounts: r };
    } catch (e) { return { ok: false, error: (e && e.message) || 'request denied' }; }
    return { ok: false, error: 'wallet returned no accounts' };
  }

  // Switch the wallet to BASE mainnet; add the chain if the wallet doesn't know it.
  async function ensureBaseChain(prov) {
    if (!prov || typeof prov.request !== 'function') return { ok: false, error: 'no provider' };
    try {
      await prov.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE.chainId }] });
      return { ok: true };
    } catch (e) {
      const err = e && e.code;
      if (err === 4902 || (e && /unrecognized|unknown chain|not added/i.test(String(e.message)))) {
        try {
          await prov.request({ method: 'wallet_addEthereumChain', params: [BASE] });
          await prov.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE.chainId }] });
          return { ok: true };
        } catch (e2) { return { ok: false, error: (e2 && e2.message) || 'could not add Base' }; }
      }
      return { ok: false, error: (e && e.message) || 'switch failed' };
    }
  }

  async function connect(key) {
    const prov = walletFor(key);
    if (!prov) return { ok: false, error: 'wallet not detected' };
    const acc = await requestAccounts(prov);
    if (!acc.ok) return acc;
    await ensureBaseChain(prov);
    let chainId = null;
    try { const c = await prov.request({ method: 'eth_chainId', params: [] }); chainId = c; } catch {}
    const p = providers.find(x => x.key === key);
    connected = { address: acc.accounts[0], providerKey: key, providerName: p ? p.name : key, provider: prov, chainId: chainId || BASE.chainId };
    return { ok: true, ...connected };
  }

  function connectManual(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return { ok: false, error: 'invalid address' };
    connected = { address: address.toLowerCase(), providerKey: 'manual', providerName: 'manual', provider: null, chainId: BASE.chainId };
    return { ok: true, ...connected };
  }

  function disconnect() { connected = { address: null, providerKey: null, providerName: null, provider: null, chainId: null }; return connected; }
  function state() { return { ...connected, detected: detected() }; }
  function isBase(chainId) { return String(chainId).toLowerCase() === '0x2105'; }

  return { connect, connectManual, disconnect, state, detected, providers, ensureBaseChain, isBase, BASE };
})();