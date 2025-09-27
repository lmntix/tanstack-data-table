// store/columnStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ColumnVisibilityState {
  visibleColumns: Record<string, boolean>
  setColumnVisibility: (columnId: string, visible: boolean) => void
  resetToDefault: () => void
}

// Define initial visible columns
export const defaultVisibleColumns: Record<string, boolean> = {
  // Pinned left columns
  transactionId: true,
  amount: true,

  // Main columns
  status: true,
  type: true,
  merchantName: true,
  category: true,
  userEmail: true,
  paymentMethod: true,
  createdAt: true,

  // Hidden by default
  currency: false,
  description: false,
  userId: false,
  referenceNumber: false,
  isRecurring: false,
  tags: false,
  updatedAt: false,
  processedAt: false,

  // Pinned right columns
  id: true
}

export const useColumnStore = create<ColumnVisibilityState>()(
  persist(
    (set) => ({
      visibleColumns: defaultVisibleColumns,

      setColumnVisibility: (columnId: string, visible: boolean) =>
        set((state) => ({
          visibleColumns: {
            ...state.visibleColumns,
            [columnId]: visible
          }
        })),

      resetToDefault: () => set({ visibleColumns: defaultVisibleColumns })
    }),
    {
      name: "transaction-columns",
      version: 1
    }
  )
)
