import React, { useCallback } from "react";

import LoadingScreen from "@/components/LoadingScreen";
import { SplitScreenPreview } from "@/components/previews";
import { defineView } from "@/components/views/defineView";
import { useEventListener, useViewContext } from "@/hooks";
import styled from "styled-components";

import CoverFlow from "./CoverFlow";
import { IpodEvent } from "@/utils/events";
import { useFetchAlbums } from "@/hooks/utils/useDataFetcher";

const Container = styled.div`
  height: 100%;
  flex: 1;
`;

const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: #777;
`;

const _CoverFlowView = () => {
  const { hideView } = useViewContext();
  const { data, isLoading } = useFetchAlbums({
    artworkSize: 350,
  });

  const albums = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const handleMenuClick = useCallback(() => {
    if (isLoading || albums.length === 0) {
      hideView();
    }
  }, [albums.length, hideView, isLoading]);

  useEventListener<IpodEvent>("menuclick", handleMenuClick);

  return (
    <Container>
      {isLoading ? (
        <LoadingScreen backgroundColor="white" />
      ) : albums.length === 0 ? (
        <EmptyContainer>No albums in library</EmptyContainer>
      ) : (
        <CoverFlow albums={albums} />
      )}
    </Container>
  );
};

export const CoverFlowView = Object.assign(_CoverFlowView, {
  viewConfig: defineView({
    component: _CoverFlowView,
    type: "coverFlow",
    title: "Cover Flow",
    preview: SplitScreenPreview.Music,
  }),
});
