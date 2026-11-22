"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ColorScheme } from "@/utils/colorScheme";
import { DeviceThemeName, getThemeParam } from "@/utils/themes";
import { SELECTED_SERVICE_KEY } from "@/utils/constants/api";

export type StreamingService = "local";

export type ShuffleMode = "off" | "songs" | "albums";
export type RepeatMode = "off" | "one" | "all";

export const VOLUME_KEY = "ipodVolume";
export const COLOR_SCHEME_KEY = "ipodColorScheme";
export const DEVICE_COLOR_KEY = "ipodSelectedDeviceTheme";
export const SHUFFLE_MODE_KEY = "ipodShuffleMode";
export const REPEAT_MODE_KEY = "ipodRepeatMode";
export const HAPTICS_ENABLED_KEY = "ipodHapticsEnabled";

export interface SettingsState {
  service: StreamingService;
  isAuthorized: boolean;
  isOffline: boolean;
  colorScheme: ColorScheme;
  deviceTheme: DeviceThemeName;
  shuffleMode: ShuffleMode;
  repeatMode: RepeatMode;
  hapticsEnabled: boolean;
}

type SettingsContextType = [
  SettingsState,
  React.Dispatch<React.SetStateAction<SettingsState>>,
];

const defaultSettingsState: SettingsState = {
  service: "local",
  isAuthorized: true,
  isOffline: false,
  colorScheme: "default",
  deviceTheme: "silver",
  shuffleMode: "off",
  repeatMode: "off",
  hapticsEnabled: true,
};

export const SettingsContext = createContext<SettingsContextType>([
  defaultSettingsState,
  () => {},
]);

export type SettingsHook = SettingsState & {
  setService: (service?: StreamingService) => void;
  setColorScheme: (colorScheme?: ColorScheme) => void;
  setDeviceTheme: (deviceTheme: DeviceThemeName) => void;
  setShuffleMode: (mode: ShuffleMode) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setHapticsEnabled: (enabled: boolean) => void;
};

export const useSettings = (): SettingsHook => {
  const [state, setState] = useContext(SettingsContext);

  const setService = useCallback(
    (service: StreamingService = "local") => {
      if (typeof window === "undefined") return;

      setState((prevState) => ({
        ...prevState,
        service,
      }));

      localStorage.setItem(SELECTED_SERVICE_KEY, service);
    },
    [setState]
  );

  const setDeviceTheme = useCallback(
    (deviceTheme: DeviceThemeName) => {
      setState((prevState) => ({ ...prevState, deviceTheme }));
      if (typeof window !== "undefined") {
        localStorage.setItem(DEVICE_COLOR_KEY, deviceTheme);
      }
    },
    [setState]
  );

  const setColorScheme = useCallback(
    (colorScheme?: ColorScheme) => {
      setState((prevState) => {
        const updatedColorScheme =
          (colorScheme ?? prevState.colorScheme === "dark")
            ? "default"
            : "dark";

        if (typeof window !== "undefined") {
          localStorage.setItem(COLOR_SCHEME_KEY, `${updatedColorScheme}`);
        }

        return {
          ...prevState,
          colorScheme: updatedColorScheme,
        };
      });
    },
    [setState]
  );

  const setShuffleMode = useCallback(
    (mode: ShuffleMode) => {
      setState((prevState) => ({ ...prevState, shuffleMode: mode }));
      if (typeof window !== "undefined") {
        localStorage.setItem(SHUFFLE_MODE_KEY, mode);
      }
    },
    [setState]
  );

  const setRepeatMode = useCallback(
    (mode: RepeatMode) => {
      setState((prevState) => ({ ...prevState, repeatMode: mode }));
      if (typeof window !== "undefined") {
        localStorage.setItem(REPEAT_MODE_KEY, mode);
      }
    },
    [setState]
  );

  const setHapticsEnabled = useCallback(
    (enabled: boolean) => {
      setState((prevState) => ({ ...prevState, hapticsEnabled: enabled }));
      if (typeof window !== "undefined") {
        localStorage.setItem(HAPTICS_ENABLED_KEY, enabled ? "true" : "false");
      }
    },
    [setState]
  );

  return {
    ...state,
    setService,
    setColorScheme,
    setDeviceTheme,
    setShuffleMode,
    setRepeatMode,
    setHapticsEnabled,
  };
};

interface Props {
  children: React.ReactNode;
}

export const SettingsProvider = ({ children }: Props) => {
  const [settingsState, setSettingsState] = useState<SettingsState>(defaultSettingsState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlTheme = getThemeParam();
    const storedTheme = (localStorage.getItem(DEVICE_COLOR_KEY) as DeviceThemeName) || "silver";
    const storedColorScheme = (localStorage.getItem(COLOR_SCHEME_KEY) as ColorScheme) || "default";
    const storedShuffle = (localStorage.getItem(SHUFFLE_MODE_KEY) as ShuffleMode) || "off";
    const storedRepeat = (localStorage.getItem(REPEAT_MODE_KEY) as RepeatMode) || "off";
    const storedHaptics = localStorage.getItem(HAPTICS_ENABLED_KEY) !== "false";

    setSettingsState((prev) => ({
      ...prev,
      isOffline: !navigator.onLine,
      deviceTheme: urlTheme || storedTheme,
      colorScheme: storedColorScheme,
      shuffleMode: storedShuffle,
      repeatMode: storedRepeat,
      hapticsEnabled: storedHaptics,
    }));

    const syncOnlineStatus = () =>
      setSettingsState((prev) => {
        const offline = !navigator.onLine;
        if (prev.isOffline === offline) return prev;
        return { ...prev, isOffline: offline };
      });

    window.addEventListener("offline", syncOnlineStatus);
    window.addEventListener("online", syncOnlineStatus);

    return () => {
      window.removeEventListener("offline", syncOnlineStatus);
      window.removeEventListener("online", syncOnlineStatus);
    };
  }, []);

  return (
    <SettingsContext.Provider value={[settingsState, setSettingsState]}>
      {children}
    </SettingsContext.Provider>
  );
};

export default useSettings;
