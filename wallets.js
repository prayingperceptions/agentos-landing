// wallets.js — human wallet-connect for Agent DEX (EIP-1193 + injected providers + manual).
// Mirrors Uniswap's connect pattern: detect the installed wallet, request accounts,
// and fall back to a pasted address (so agents/humans without a browser wallet can act).
window.DexWallet = (() => {
  const providers = [
    { key: 'ethereum', name: 'Ethereum / MetaMask', ok: () => !!window.ethereum },
    { key: 'rainbow', name: 'Rainbow', ok: () => !!window.rainbow },
    { key: 'coinbaseWallet', name: 'Coinbase Wallet', ok: () => !!window.coinbaseWallet },
    { key: 'okxwallet', name: 'OKX Wallet', ok: () => !!window.okxwallet && !!window.okxwallet.ethereum },
  ];
  let connected = { address: null, provider: null, network: null };

  function detected() { return providers.filter((p) => p.ok()).map((p) => p.name); }

  async function requestAccounts(prov) {
    const base = prov && prov.key === 'okxwallet' ? window.okxwallet.ethereum : window.ethereum || window[prov ? prov.key : 'ethereum'];
    // EIP-1193 standard request first
    if (base && typeof base.request === 'function') {
      try {
        const res = await base.request({ method: 'eth_requestAccounts', params: [] });
        if (res && res.length) return { ok: true, accounts: res, provider: prov ? prov.name : 'EIP-1193' };
      } catch { /* fall through */ }
    }
    // legacy eth_accounts
    if (base && typeof base.request === 'function') {
      try {
        const r = await base.request({ method: 'eth_accounts', params: [] });
        if (r && r.length) return { ok: true, accounts: r, provider: prov ? prov.name : 'legacy' };
      } catch {
        try { const r2 = await base.request({ method: 'eth_accounts' }); if (r2 && r2.length) return { ok: true, accounts: r2, provider: 'legacy' }; } catch {}
      }
    }
    // MetaMask legacy API (window.ethereum.enable / eth_accounts)
    if (base && typeof base.enable === 'function') {
      try {
        const r = await base.enable();
        if (r) return { ok: true, accounts: r, provider: prov ? prov.name : 'legacy' };
      } catch {}
    }
    return { ok: false, error: 'wallet returned no accounts' };
  }

  async function connect(providerName) {
    const prov = providers.find((p) => p.name === providerName || p.key === providerName);
    const r = await requestAccounts(prov);
    if (r.ok && r.accounts && r.accounts.length) {
      connected = { address: r.accounts[0], provider: r.provider, network: 'eip155:8453' };
      return { ok: true, ...connected };
    }
    return { ok: false, error: r.error || 'no wallet detected' };
  }

  // manual: agents or headless can paste any address
  function connectManual(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return { ok: false, error: 'invalid address' };
    connected = { address: address.toLowerCase(), provider: 'manual', network: 'eip155:8453' };
    return { ok: true, ...connected };
  }

  function disconnect() { connected = { address: null, provider: null, network: null }; return connected; }
  function state() { return { ...connected, detected: detected() }; }

  return { connect, connectManual, disconnect, state, detected, providers };
})();