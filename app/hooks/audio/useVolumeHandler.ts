import { useCallback, useState } from "react";
import { useAudioPlayer } from "./useAudioPlayer";

export const useVolumeHandler = () => {
  const { volume, setVolume } = useAudioPlayer();
  const [isScrubbing, setIsScrubbing] = useState(false);

  const increaseVolume = useCallback(() => {
    setVolume(Math.min(volume + 0.05, 1));
  }, [setVolume, volume]);

  const decreaseVolume = useCallback(() => {
    setVolume(Math.max(volume - 0.05, 0));
  }, [setVolume, volume]);

  const setEnabled = useCallback((enabled: boolean) => {
    setIsScrubbing(!enabled);
  }, []);

  return {
    volume,
    active: !isScrubbing,
    setEnabled,
    increaseVolume,
    decreaseVolume,
  };
};

export default useVolumeHandler;
