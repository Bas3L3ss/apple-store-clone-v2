import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../@types";
import { v4 as uuidV4 } from "uuid";
import { io, Socket } from "socket.io-client";
import {
  syncCartWithBackend,
  removeCartItem,
  clearUserCart,
  updateCartItemQuantity,
} from "../action/cart";
import { toast } from "sonner";
import { WEBSOCKET_URL } from "../constants";

export interface CartInput {
  selectedOptions: string[];
  totalPrice: number;
  productId: string;
  userId?: string;
}

interface CartState {
  userItems: CartItem[];
  guestItems: CartItem[];
  socket: Socket | null;
  isConnected: boolean;
  temporaryFailedItems: CartItem[];
  addItem: (product: CartInput) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: -1 | 1) => void;
  clearCart: () => void;
  syncGuestCart: (userId: string) => void;
  rejectGuestCart: () => void;
  hasGuestCart: boolean;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
  retryFailedItems: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      userItems: [],
      guestItems: [],
      socket: null,
      isConnected: false,
      temporaryFailedItems: [],
      hasGuestCart: false,

      connectSocket: (userId: string) => {
        const socket =
          WEBSOCKET_URL == "ws://localhost:3001"
            ? io(WEBSOCKET_URL, {
                query: { userId },
              })
            : io("/", {
                query: { userId },
                path: "/socket.io",
                transports: ["polling", "websocket"], //required
              });

        socket.on("connect", () => {
          set({ isConnected: true });

          socket.emit(
            "cart:get",
            null,
            (response: { success: boolean; data: { items: CartItem[] } }) => {
              if (response.success && response.data) {
                set({ userItems: response.data.items });
                console.log("Connected to Websocket");
              } else {
                console.error("Failed to fetch cart data");
              }
            }
          );
        });

        socket.on("disconnect", () => {
          set({ isConnected: false });
          set({ userItems: [] });
          console.log("Disconnected from cart WebSocket");
        });

        socket.on("cart:updated", (updatedCart: CartItem[]) => {
          set({ userItems: updatedCart });
        });

        // Set socket without persisting it
        set(() => ({ socket }), false);
      },

      disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null, isConnected: false });
        }
      },

      addItem: (cart: CartInput) => {
        if (cart.userId) {
          // User is logged in - add to user items
          const { userItems } = get();
          const existingItem = userItems.find(
            (item) =>
              item.productId === cart.productId &&
              JSON.stringify(item.selectedOptions.sort()) ===
                JSON.stringify(cart.selectedOptions.sort())
          );

          let updatedItems: CartItem[];

          if (existingItem) {
            updatedItems = userItems.map((item) =>
              item.productId === cart.productId &&
              JSON.stringify(item.selectedOptions.sort()) ===
                JSON.stringify(cart.selectedOptions.sort())
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    totalPrice:
                      item.totalPrice + item.totalPrice / item.quantity,
                  }
                : item
            );
          } else {
            const newItem = {
              ...cart,
              quantity: 1,
              _id: uuidV4(),
              userId: cart.userId,
            };
            updatedItems = [...userItems, newItem];
          }

          set({ userItems: updatedItems });

          syncCartWithBackend(updatedItems).catch((error) => {
            console.error("Failed to sync cart with backend:", error);
            // Store the failed operation for retry
            set((state) => ({
              temporaryFailedItems: [
                ...state.temporaryFailedItems,
                ...updatedItems,
              ],
            }));
            toast.error("Failed to update cart", {
              description:
                "Your changes will be saved locally. Click to retry.",
              action: {
                label: "Retry",
                onClick: () => get().retryFailedItems(),
              },
            });
          });
        } else {
          const { guestItems } = get();
          const existingItem = guestItems.find(
            (item) =>
              item.productId === cart.productId &&
              JSON.stringify(item.selectedOptions.sort()) ===
                JSON.stringify(cart.selectedOptions.sort())
          );

          if (existingItem) {
            set({
              guestItems: guestItems.map((item) =>
                item.productId === cart.productId &&
                JSON.stringify(item.selectedOptions.sort()) ===
                  JSON.stringify(cart.selectedOptions.sort())
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      totalPrice:
                        item.totalPrice + item.totalPrice / item.quantity,
                    }
                  : item
              ),
              hasGuestCart: true,
            });
          } else {
            set({
              guestItems: [
                ...guestItems,
                { ...cart, quantity: 1, _id: uuidV4() },
              ],
              hasGuestCart: true,
            });
          }
        }
      },

      removeItem: (cartId: string) => {
        const { userItems, guestItems } = get();

        const userItem = userItems.find((item) => item._id === cartId);

        if (userItem) {
          const updatedItems = userItems.filter((item) => item._id !== cartId);
          set({ userItems: updatedItems });

          removeCartItem(cartId).catch((error) => {
            console.error("Failed to remove item from backend:", error);
            toast.error("Failed to remove item", {
              description: "Item was removed locally but not on the server.",
            });
          });
        } else {
          set({
            guestItems: guestItems.filter((item) => item._id !== cartId),
            hasGuestCart: guestItems.length > 1,
          });
        }
      },

      updateQuantity: (cartId: string, change: -1 | 1) => {
        const { userItems } = get();

        const userItem = userItems.find((item) => item._id === cartId);

        if (userItem) {
          const updatedItems = userItems
            .map((item) => {
              if (item._id === cartId) {
                const newQuantity = item.quantity + change;

                if (newQuantity <= 0) {
                  return null;
                }

                return {
                  ...item,
                  quantity: newQuantity,
                  totalPrice: newQuantity * (item.totalPrice / item.quantity),
                };
              }
              return item;
            })
            .filter(Boolean);
          //@ts-expect-error:no problem
          set({ userItems: updatedItems });

          // Sync with backend
          updateCartItemQuantity(cartId, change).catch((error) => {
            console.error("Failed to update item quantity on backend:", error);
            toast.error("Failed to update quantity", {
              description:
                "Quantity was updated locally but not on the server.",
            });
          });
        } else {
          // Update guest items
          //@ts-expect-error: no problem
          set((state) => {
            const updatedItems = state.guestItems
              .map((item) => {
                if (item._id === cartId) {
                  const newQuantity = item.quantity + change;

                  if (newQuantity <= 0) {
                    return null;
                  }

                  return {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: newQuantity * (item.totalPrice / item.quantity),
                  };
                }
                return item;
              })
              .filter(Boolean);

            return {
              guestItems: updatedItems,
              hasGuestCart: updatedItems.length > 0,
            };
          });
        }
      },

      clearCart: () => {
        const { userItems } = get();

        // If there are user items, clear them on the backend too
        if (userItems.length > 0) {
          clearUserCart().catch((error) => {
            console.error("Failed to clear cart on backend:", error);
            toast.error("Failed to clear cart on server", {
              description: "Cart was cleared locally but not on the server.",
            });
          });
        }

        set({ userItems: [], guestItems: [], hasGuestCart: false });
      },

      syncGuestCart: (userId: string) => {
        const { guestItems, userItems } = get();

        if (guestItems.length > 0) {
          const mergedItems = [...userItems];

          const authenticatedGuesItems = guestItems.map((i) => ({
            ...i,
            userId,
          }));
          authenticatedGuesItems.forEach((guestItem) => {
            const existingItemIndex = mergedItems.findIndex(
              (item) =>
                item.productId === guestItem.productId &&
                JSON.stringify(item.selectedOptions.sort()) ===
                  JSON.stringify(guestItem.selectedOptions.sort())
            );

            if (existingItemIndex >= 0) {
              const existingItem = mergedItems[existingItemIndex];
              mergedItems[existingItemIndex] = {
                ...existingItem,
                quantity: existingItem.quantity + guestItem.quantity,
                totalPrice: existingItem.totalPrice + guestItem.totalPrice,
              };
            } else {
              mergedItems.push({
                ...guestItem,
                userId: userId,
              });
            }
          });

          set({ userItems: mergedItems, guestItems: [], hasGuestCart: false });

          syncCartWithBackend(mergedItems).catch((error) => {
            console.error("Failed to sync merged cart with backend:", error);
            toast.error("Failed to sync guest cart", {
              description:
                "Your cart was merged locally but not on the server.",
            });
          });
        } else {
          set({ hasGuestCart: false });
        }
      },

      rejectGuestCart: () => {
        set({ guestItems: [], hasGuestCart: false });
      },

      retryFailedItems: () => {
        const { temporaryFailedItems, userItems } = get();

        if (temporaryFailedItems.length > 0) {
          syncCartWithBackend([...userItems, ...temporaryFailedItems])
            .then(() => {
              // On success, clear the failed items list
              set({ temporaryFailedItems: [] });
              toast.success("Cart synchronized successfully");
            })
            .catch((error) => {
              console.error("Retry failed:", error);
              toast.error("Synchronization failed again", {
                description: "Please try again later or contact support.",
              });
            });
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        userItems: state.userItems,
        guestItems: state.guestItems,
        temporaryFailedItems: state.temporaryFailedItems,
        hasGuestCart: state.hasGuestCart,
        isConnected: state.isConnected,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.guestItems.length > 0) {
          state.hasGuestCart = true;
        }
      },
    }
  )
);
