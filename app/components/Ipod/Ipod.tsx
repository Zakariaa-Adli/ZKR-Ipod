"use client";

import { memo, useState } from "react";
import {
  AudioPlayerProvider,
  useEffectOnce,
  useSettings,
} from "@/hooks";
import { SettingsProvider } from "@/hooks/utils/useSettings";
import { ClickWheel, ViewManager } from "@/components";
import {
  ScreenContainer,
  ClickWheelContainer,
  Shell,
  Sticker,
  Sticker2,
  Sticker3,
} from "@/components/Ipod/Styled";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ViewContextProvider from "@/providers/ViewContextProvider";
import { GlobalStyles } from "@/components/Ipod/GlobalStyles";

type Props = {
  appleAccessToken?: string;
};

const IpodContent = () => {
  const { deviceTheme } = useSettings();
  const currentTheme = deviceTheme ?? "silver";

  return (
    <Shell $deviceTheme={currentTheme}>
      <Sticker $deviceTheme={currentTheme} />
      <Sticker2 $deviceTheme={currentTheme} />
      <Sticker3 $deviceTheme={currentTheme} />
      <ScreenContainer>
        <ViewManager />
      </ScreenContainer>
      <ClickWheelContainer>
        <ClickWheel />
      </ClickWheelContainer>
    </Shell>
  );
};

const Ipod = ({}: Props) => {
  const [queryClient] = useState(() => new QueryClient());
  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => {
    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <SettingsProvider>
        <ViewContextProvider>
          <AudioPlayerProvider>
            <IpodContent />
          </AudioPlayerProvider>
        </ViewContextProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default memo(Ipod);
