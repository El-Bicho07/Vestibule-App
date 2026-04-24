import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOCK_APPS } from "../constants/config";

export interface BlockedApp {
  id: string;
  name: string;
  icon: string;
  blocked: boolean;
}

interface BlocklistState {
  apps: BlockedApp[];
  iosFocusLinked: boolean;
  androidUsageAccessGranted: boolean;
  toggleApp: (id: string) => void;
  setBlocked: (id: string, blocked: boolean) => void;
  setIosFocusLinked: (linked: boolean) => void;
  setAndroidUsageAccessGranted: (granted: boolean) => void;
  reset: () => void;
}

const initialApps: BlockedApp[] = MOCK_APPS.map((a) => ({ ...a }));

export const useBlocklistStore = create<BlocklistState>()(
  persist(
    (set) => ({
      apps: initialApps,
      iosFocusLinked: false,
      androidUsageAccessGranted: false,

      toggleApp: (id) =>
        set((s) => ({
          apps: s.apps.map((a) => (a.id === id ? { ...a, blocked: !a.blocked } : a)),
        })),

      setBlocked: (id, blocked) =>
        set((s) => ({
          apps: s.apps.map((a) => (a.id === id ? { ...a, blocked } : a)),
        })),

      setIosFocusLinked: (linked) => set({ iosFocusLinked: linked }),
      setAndroidUsageAccessGranted: (granted) =>
        set({ androidUsageAccessGranted: granted }),

      reset: () =>
        set({
          apps: initialApps,
          iosFocusLinked: false,
          androidUsageAccessGranted: false,
        }),
    }),
    {
      name: "vestibule-blocklist",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
