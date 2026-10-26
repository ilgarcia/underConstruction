/**
 * Query keys of the /cash-flow page. Each entity has an `all` prefix so a mutation
 * can invalidate every list of that entity at once.
 */
const root = ["cash-flow"] as const;

const cashFlowKeys = {
  wallet: [...root, "wallet"] as const,
  expenses: {
    all: [...root, "expenses"] as const,
    list: (walletId: string) => [...root, "expenses", walletId] as const,
  },
  extraExpenses: {
    all: [...root, "extra-expenses"] as const,
    list: (walletId: string) => [...root, "extra-expenses", walletId] as const,
  },
  receivables: {
    all: [...root, "receivables"] as const,
    list: (walletId: string) => [...root, "receivables", walletId] as const,
  },
  creditCards: {
    all: [...root, "credit-cards"] as const,
    list: (walletId: string) => [...root, "credit-cards", walletId] as const,
  },
  /** Recurring charges of the cards, per card (editor) and per wallet (projection). */
  cardCharges: {
    all: [...root, "card-charges"] as const,
    byCard: (cardId: string) => [...root, "card-charges", "card", cardId] as const,
    byWallet: (walletId: string) => [...root, "card-charges", "wallet", walletId] as const,
  },
  invoices: {
    all: [...root, "invoices"] as const,
    list: (walletId: string) => [...root, "invoices", walletId] as const,
  },
};

export { cashFlowKeys };
