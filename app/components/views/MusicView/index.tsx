import React, { useMemo } from "react";

import { defineView } from "@/components/views/defineView";
import { SelectableListOption } from "@/components/SelectableList";
import SelectableListView from "@/components/SelectableListView";
import { SplitScreenPreview } from "@/components/previews";
import { useAudioPlayer } from "@/hooks";
import { useSettings } from "@/hooks";

const _MusicView = () => {
  const { isAuthorized } = useSettings();
  const { nowPlayingItem } = useAudioPlayer();

  const options: SelectableListOption[] = useMemo(() => {
    const arr: SelectableListOption[] = [
      {
        type: "view",
        label: "Cover Flow",
        viewId: "coverFlow",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Playlists",
        viewId: "playlists",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Artists",
        viewId: "artists",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Albums",
        viewId: "albums",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Songs",
        viewId: "songs",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Search",
        viewId: "search",
        preview: SplitScreenPreview.Music,
      },
    ];

    // Add Now Playing view if there's a currently playing track
    if (!!nowPlayingItem) {
      arr.push({
        type: "view",
        label: "Now playing",
        viewId: "nowPlaying",
        preview: SplitScreenPreview.NowPlaying,
      });
    }

    return arr;
  }, [isAuthorized, nowPlayingItem]);

  return <SelectableListView viewId="music" options={options} />;
};

export const MusicView = Object.assign(_MusicView, {
  viewConfig: defineView({
    component: _MusicView,
    type: "split",
    title: "Music",
    isSplitScreen: true,
    preview: SplitScreenPreview.Music,
  }),
});
