# Agent DEX — the token launch venue for humans *and* agents

**Uniswap liquidity. PumpDotFun ease. Agent-native rails.**

Launch a token in two clicks, pool **real USDC** liquidity, and watch **24/7 on-chain
volume** — on Base, open source, no signup, no platform lock-in. Your 0.5% receipt
doesn't sit idle: it's an LP position that **earns**.

---

## What it is

Agent DEX is the trade floor for the agent economy. It takes an agent-launched token and
gives it instant, tradable, gated liquidity:

1. **Launch** — mint a token with a transparent, disclosed split.
2. **Pool** — seed it against real USDC, like adding liquidity on Uniswap.
3. **Trade** — buy/sell through a constant-product pool, every order identity +
   permission + safety gated (fail-closed).
4. **Earn** — every rail pays the protocol; your launch receipt is an LP position.

## The split (exactly, provable on-chain)

| Share | Goes to |
|---|---|
| **1%** | Deployer |
| **0.5%** | Protocol recipient (minted at launch) |
| **0.5%** | Lottery escrow → **one wallet after ≥100 traders** (human or agent — the venue can't tell) |
| **98%** | Tradable float → pooled against USDC/ETH |

Total 100%. Supply conserved (tested).

## Fees — protocol earns at every rail

- **0.5%** at launch (atomic, cannot be skipped)
- **0.5%** on listing (of the seed quote)
- **0.05%** per trade — half to the protocol rail, half accrues to **LP holders** by shares
- **0.5%** lottery escrow → one trader after 100+ distinct wallets trade

## Build / product proof

| Proof | Where |
|---|---|
| **Compute (CPT)** live on Base mainnet | [Basescan](https://basescan.org/token/0xad3dc01fe083def0f3e7de0f2164865494eb0322) — split verified on-chain |
| **Venue** (Agent DEX) | [`0xB1a77D1CEBb2BdF7A1Dd12758992BfC1408de996`](https://basescan.org/address/0xB1a77D1CEBb2BdF7A1Dd12758992BfC1408de996) |
| **Contracts** | [agent-dex](https://github.com/prayingperceptions/agent-dex) — **7/7 Foundry tests** |
| **Endpoint + x402 pay-per-call** | live · **12/12 tests** · Bazaar-discoverable |
| **24/7 volume** (CoinGecko-style) | [`/stats`](https://agent-dex-eight.vercel.app/stats) |

## Try it now

- **Launch a token** → [agentos-landing.vercel.app/launch.html](https://agentos-landing.vercel.app/launch.html)
- **Live demo** → [agentos-landing.vercel.app/demo.html](https://agentos-landing.vercel.app/demo.html)
- **Repo** → [github.com/prayingperceptions/agent-dex](https://github.com/prayingperceptions/agent-dex)

## Availability note

Compute is launched on Base but not yet pooled — opening the USDC pool (and flipping
live volume from 0) needs a USDC-seeded wallet to run `list()`. The code path is done
and tested; it's a one-command step for any USDC holder. Want to provide the seed?

---

Open source · MIT · built on [x402](https://x402.org) · [Base](https://base.org) ·
[Coinbase CDP](https://www.coinbase.com/developer-platform) — no lock-in.
Questions or support: prayingperceptions@gmail.com