import { useMemo } from "react";

import { defineView } from "@/components/views/defineView";
import { SelectableListOption } from "@/components/SelectableList";
import SelectableListView from "@/components/SelectableListView";
import { SplitScreenPreview } from "@/components/previews";
import { useAudioPlayer, useSettings } from "@/hooks";

const THEMES = ["silver", "black", "u2"] as const;

const formatCurrentLabel = (label: string, isCurrent: boolean) =>
  `${label}${isCurrent ? " (Current)" : ""}`;

const getThemeLabel = (theme: (typeof THEMES)[number]) => {
  if (theme === "u2") return "U2 Edition";
  return theme.charAt(0).toUpperCase() + theme.slice(1);
};

const _SettingsView = () => {
  const {
    deviceTheme,
    setDeviceTheme,
    shuffleMode,
    repeatMode,
    hapticsEnabled,
    setHapticsEnabled,
  } = useSettings();
  const { setShuffleMode, setRepeatMode } = useAudioPlayer();

  const themeOptions: SelectableListOption[] = useMemo(
    () =>
      THEMES.map((theme) => ({
        type: "action",
        isSelected: deviceTheme === theme,
        label: formatCurrentLabel(getThemeLabel(theme), deviceTheme === theme),
        onSelect: () => setDeviceTheme(theme),
      })),
    [deviceTheme, setDeviceTheme]
  );

  const options: SelectableListOption[] = useMemo(
    () => [
      {
        type: "view",
        label: "About",
        viewId: "about",
        preview: SplitScreenPreview.Settings,
      },
      {
        type: "actionSheet",
        label: "Shuffle",
        listOptions: [
          {
            type: "action",
            isSelected: shuffleMode === "off",
            label: `Off ${shuffleMode === "off" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("off"),
          },
          {
            type: "action",
            isSelected: shuffleMode === "songs",
            label: `Songs ${shuffleMode === "songs" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("songs"),
          },
          {
            type: "action",
            isSelected: shuffleMode === "albums",
            label: `Albums ${shuffleMode === "albums" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("albums"),
          },
        ],
        preview: SplitScreenPreview.Settings,
      },
      {
        type: "actionSheet",
        label: "Repeat",
        listOptions: [
          {
            type: "action",
            isSelected: repeatMode === "off",
            label: `Off ${repeatMode === "off" ? "(Current)" : ""}`,
            onSelect: () => setRepeatMode("off"),
          },
          {
            type: "action",
            isSelected: repeatMode === "one",
            label: `One ${repeatMode === "one" ? "(Current)" : ""}`,
            onSelect: () => setRepeatMode("one"),
          },
          {
            type: "action",
            isSelected: repeatMode === "all",
            label: `All ${repeatMode === "all" ? "(Current)" : ""}`,
            onSelect: () => setRepeatMode("all"),
          },
        ],
        preview: SplitScreenPreview.Settings,
      },
      {
        type: "actionSheet",
        label: "Device theme",
        listOptions: themeOptions,
        preview: SplitScreenPreview.Theme,
      },
      {
        type: "actionSheet",
        label: "Haptic feedback",
        listOptions: [
          {
            type: "action",
            isSelected: hapticsEnabled,
            label: `On ${hapticsEnabled ? "(Current)" : ""}`,
            onSelect: () => setHapticsEnabled(true),
          },
          {
            type: "action",
            isSelected: !hapticsEnabled,
            label: `Off ${!hapticsEnabled ? "(Current)" : ""}`,
            onSelect: () => setHapticsEnabled(false),
          },
        ],
        preview: SplitScreenPreview.Settings,
      },
    ],
    [
      shuffleMode,
      setShuffleMode,
      repeatMode,
      setRepeatMode,
      themeOptions,
      hapticsEnabled,
      setHapticsEnabled,
    ]
  );

  return <SelectableListView viewId="settings" options={options} />;
};

export const SettingsView = Object.assign(_SettingsView, {
  viewConfig: defineView({
    component: _SettingsView,
    type: "split",
    title: "Settings",
    isSplitScreen: true,
    preview: SplitScreenPreview.Settings,
  }),
});
