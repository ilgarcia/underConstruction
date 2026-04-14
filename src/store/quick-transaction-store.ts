import { create } from "zustand";
import { QuickTransactionData } from "@/components/form/cash-flow-form/quick-transaction/schema";

interface QuickTransactionState {
  initialData: QuickTransactionData;
  data: QuickTransactionData;
  setInitialData: (data: QuickTransactionData) => void;
  saveData: (data: QuickTransactionData) => void;
  syncExternalData: (newData: QuickTransactionData, isDirty: boolean) => void;
}

const defaultData: QuickTransactionData = { balance: 0, invoice: 0, accounts: 0, receivables: 0 };

export const useQuickTransactionStore = create<QuickTransactionState>((set) => ({
  initialData: defaultData,
  data: defaultData,
  
  setInitialData: (data) => set({ initialData: data, data }),
  
  saveData: (data) => set({ data }),
  
  // Sincroniza dados do backend respeitando a interação local
  syncExternalData: (newData, isDirty) => set((state) => {
    // Se o formulário NÃO foi alterado pelo usuário (isDirty = false),
    // é seguro sobrescrever tanto o estado inicial quanto os dados da UI
    if (!isDirty) {
      return { initialData: newData, data: newData };
    }
    
    // Se o formulário FOI alterado, não sobrescrevemos o "data" atual 
    // para não perder o rascunho do usuário, apenas atualizamos a referência inicial 
    // que veio do servidor.
    return { initialData: newData };
  }),
}));
