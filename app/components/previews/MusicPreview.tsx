import { useMemo } from "react";

import KenBurns from "@/components/KenBurns";
import LoadingScreen from "@/components/LoadingScreen";
import { motion } from "motion/react";
import { useSettings } from "@/hooks";
import styled from "styled-components";
import { useFetchAlbums } from "@/hooks/utils/useDataFetcher";
import { previewSlideRight } from "@/animation";
import { getArtwork } from "@/utils";

const Container = styled(motion.div)`
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const MusicPreview = () => {
  const { service } = useSettings();

  const {
    data: albums,
    isLoading,
    error,
  } = useFetchAlbums({
    artworkSize: 400,
  });

  const artworkUrls = useMemo(() => {
    if (albums && !error) {
      return albums.pages.flatMap(
        (page) =>
          page?.data
            .map((album) => getArtwork(300, album.artwork?.url))
            .filter((url): url is string => !!url) ?? []
      );
    }

    return [];
  }, [albums, error]);

  const isLocalMusic = service === "local";

  return (
    <Container {...previewSlideRight}>
      {isLocalMusic ? (
        <>
          {!isLoading && !albums ? (
            <LoadingScreen backgroundColor="linear-gradient(180deg, #B1B5C0 0%, #686E7A 100%)" />
          ) : artworkUrls.length > 0 ? (
            <KenBurns urls={artworkUrls} />
          ) : null}
        </>
      ) : (
        <div>
          <p>Your local music library is ready</p>
          <p>Add songs to <code>public/songs/</code> to get started</p>
        </div>
      )}
    </Container>
  );
};

export default MusicPreview;