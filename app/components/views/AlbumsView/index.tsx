import { useCallback, useMemo } from "react";

import { SelectableListOption } from "@/components/SelectableList";
import SelectableListView from "@/components/SelectableListView";
import { SplitScreenPreview } from "@/components/previews";
import { defineView } from "@/components/views/defineView";
import * as Utils from "@/utils";
import { useFetchAlbums } from "@/hooks/utils/useDataFetcher";

interface Props {
  albums?: MediaApi.Album[];
  inLibrary?: boolean;
}

const _AlbumsView = ({ albums, inLibrary = true }: Props) => {
  const {
    data: fetchedAlbums,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFetchAlbums({
    lazy: !!albums,
  });

  const options: SelectableListOption[] = useMemo(() => {
    const data =
      albums ?? fetchedAlbums?.pages.flatMap((page) => page?.data ?? []);

    return (
      data?.map((album) => ({
        type: "view",
        headerTitle: album.name,
        label: album.name,
        sublabel: album.artistName,
        imageUrl: Utils.getArtwork(300, album.artwork?.url),
        viewId: "album",
        props: { id: album.id ?? "", inLibrary },
      })) ?? []
    );
  }, [albums, fetchedAlbums, inLibrary]);

  const handleNearEndOfList = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage]);

  return (
    <SelectableListView
      viewId="albums"
      options={options}
      loading={isLoading}
      loadingNextItems={isFetchingNextPage}
      onNearEndOfList={handleNearEndOfList}
      emptyMessage="No albums in library"
    />
  );
};

export const AlbumsView = Object.assign(_AlbumsView, {
  viewConfig: defineView({
    component: _AlbumsView,
    type: "full",
    title: "Albums",
    preview: SplitScreenPreview.Music,
  }),
});
