import { useMemo } from "react";

import { SelectableListOption } from "@/components/SelectableList";
import SelectableListView from "@/components/SelectableListView";
import { SplitScreenPreview } from "@/components/previews";
import { defineView } from "@/components/views/defineView";
import * as Utils from "@/utils";
import { useFetchSongs } from "@/hooks/utils/useDataFetcher";

interface Props {
  songs?: MediaApi.Song[];
}

const _SongsView = ({ songs }: Props) => {
  const { data: fetchedSongs, isLoading } = useFetchSongs({
    lazy: !!songs,
  });

  const songList = songs ?? fetchedSongs ?? [];

  const options: SelectableListOption[] = useMemo(
    () =>
      songList.map((song, index) => ({
        type: "song",
        label: song.name,
        sublabel: `${song.artistName} • ${song.albumName}`,
        queueOptions: {
          song,
          songs: songList,
          startPosition: index,
        },
        imageUrl: Utils.getArtwork(50, song.artwork?.url),
        showNowPlayingView: true,
        longPressOptions: Utils.getMediaOptions("song", song.id),
      })),
    [songList]
  );

  return (
    <SelectableListView
      viewId="songs"
      options={options}
      loading={isLoading}
      emptyMessage="No songs in library"
    />
  );
};

export const SongsView = Object.assign(_SongsView, {
  viewConfig: defineView({
    component: _SongsView,
    type: "full",
    title: "Songs",
    preview: SplitScreenPreview.Music,
  }),
});
