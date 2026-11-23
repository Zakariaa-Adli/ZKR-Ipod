import { useCallback, useEffect, useRef, useState } from "react";

import { useInterval } from "@/hooks";
import styled from "styled-components";

const Container = styled.div``;

interface ImageProps {
  $zIndex: number;
  $startedAnimation: boolean;
  $isHidden: boolean;
}

const Image = styled.img<ImageProps>`
  z-index: ${(props) => props.$zIndex};
  position: absolute;
  height: 100%;
  right: 0;
  animation: ${(props) => props.$startedAnimation && "kenBurns"} 20s;
  opacity: ${(props) => props.$isHidden && 0};
  transition: opacity 2s;

  @keyframes kenBurns {
    0% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(10%);
    }
  }
`;

interface Props {
  urls: string[];
}

const isValidArtworkUrl = (url: unknown): url is string =>
  typeof url === "string" && url.trim().length > 0;

const KenBurns = ({ urls }: Props) => {
  const [stack, setStack] = useState<string[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutIdRef = useRef<any>(null);

  useEffect(() => {
    setStack(urls.filter(isValidArtworkUrl));
  }, [urls]);

  /** Move the currently displayed image to the bottom of the stack. */
  const cycleImage = useCallback(() => {
    setTransitioning(true);

    timeoutIdRef.current = setTimeout(() => {
      setStack((currentStack) => {
        // Never cycle an empty (or single-image) stack: doing so would push
        // `undefined` into the stack and render a broken image.
        if (currentStack.length < 2) {
          return currentStack;
        }

        return [...currentStack.slice(1), currentStack[0]];
      });
      setTransitioning(false);
    }, 2000);

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  /** Cycle through an image every 5 seconds (only when there's more than one). */
  useInterval(cycleImage, 5000, stack.length < 2);

  /** Drop an image that fails to load so a broken icon is never shown. */
  const handleImageError = useCallback((failedSrc: string) => {
    setStack((currentStack) =>
      currentStack.filter((src) => src !== failedSrc)
    );
  }, []);

  const visibleStack = stack.filter(isValidArtworkUrl);

  return (
    <Container>
      {visibleStack.slice(0, 2).map((path, index) => (
        <Image
          alt="Artwork"
          key={`ken-burns-${path}`}
          $zIndex={3 - index}
          src={path}
          $startedAnimation={index === 0 || transitioning}
          $isHidden={transitioning && index === 0}
          onError={() => handleImageError(path)}
        />
      ))}
    </Container>
  );
};

export default KenBurns;
