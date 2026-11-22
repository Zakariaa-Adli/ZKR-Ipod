import { useCallback, useMemo } from "react";

import { SelectableListOption } from "@/components/SelectableList";
import SelectableListView from "@/components/SelectableListView";
import { SplitScreenPreview } from "@/components/previews";
import { defineView } from "@/components/views/defineView";
import * as Utils from "@/utils";
import { useFetchPlaylists } from "@/hooks/utils/useDataFetcher";

interface Props {
  playlists?: MediaApi.Playlist[];
  inLibrary?: boolean;
}

const _PlaylistsView = ({ playlists, inLibrary = true }: Props) => {
  const {
    data: fetchedPlaylists,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isQueryLoading,
  } = useFetchPlaylists({
    lazy: !!playlists,
  });

  const options: SelectableListOption[] = useMemo(() => {
    const data =
      playlists ?? fetchedPlaylists?.pages.flatMap((page) => page?.data ?? []);

    return (
      data?.map((playlist) => ({
        type: "view",
        label: playlist.name,
        sublabel: playlist.description || `By ${playlist.curatorName}`,
        imageUrl: Utils.getArtwork(100, playlist.artwork?.url),
        viewId: "playlist",
        headerTitle: playlist.name,
        props: { id: playlist.id, inLibrary },
        longPressOptions: Utils.getMediaOptions("playlist", playlist.id),
      })) ?? []
    );
  }, [fetchedPlaylists?.pages, inLibrary, playlists]);

  const isLoading = !options.length && isQueryLoading;

  const handleNearEndOfList = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage]);

  return (
    <SelectableListView
      viewId="playlists"
      options={options}
      loading={isLoading}
      loadingNextItems={isFetchingNextPage}
      onNearEndOfList={handleNearEndOfList}
      emptyMessage="No playlists in library"
    />
  );
};

export const PlaylistsView = Object.assign(_PlaylistsView, {
  viewConfig: defineView({
    component: _PlaylistsView,
    type: "full",
    title: "Playlists",
    preview: SplitScreenPreview.Music,
  }),
});
