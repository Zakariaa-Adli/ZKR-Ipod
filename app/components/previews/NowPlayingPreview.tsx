import { motion } from "motion/react";
import { useAudioPlayer } from "@/hooks";
import styled from "styled-components";
import * as Utils from "@/utils";

const Container = styled(motion.div)`
  height: 100%;
`;

const Artwork = styled.img`
  height: 100%;
  width: auto;
`;

const NowPlayingPreview = () => {
  const { nowPlayingItem } = useAudioPlayer();

  if (!nowPlayingItem) return null;

  const rawArtwork =
    typeof nowPlayingItem.artwork === "string"
      ? nowPlayingItem.artwork
      : nowPlayingItem.artwork?.url;

  return (
    <Container>
      <Artwork
        src={Utils.getArtwork(300, rawArtwork)}
        alt="now playing artwork"
      />
    </Container>
  );
};

export default NowPlayingPreview;
