"use client";

import { defineView } from "@/components/views/defineView";
import { SplitScreenPreview } from "@/components/previews";
import styled from "styled-components";
import { Unit } from "@/utils/constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${Unit.MD};
`;

const LogoImage = styled.img`
  height: 3.5em;
  width: 3.5em;
  border-radius: 10px;
  margin-bottom: ${Unit.SM};
  display: block;
`;

const ProductName = styled.h2`
  margin: 0 0 ${Unit.XS};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

const Tagline = styled.p`
  margin: 0 0 ${Unit.XS};
  font-size: 12px;
  opacity: 0.65;
  text-align: center;
  line-height: 1.4;
`;

const Attribution = styled.p`
  margin: 0;
  font-size: 11px;
  opacity: 0.5;
  text-align: center;
  letter-spacing: 0.2px;
`;

const _AuthPrompt = () => {
  return (
    <Container>
      <LogoImage
        alt="ZKR logo"
        src="/logo/zkr-pure-white-on-dark.png"
      />
      <ProductName>ZKR iPod</ProductName>
      <Tagline>
        An iPod Classic-inspired music player built for the web.
      </Tagline>
      <Attribution>Designed &amp; developed by ZKR</Attribution>
    </Container>
  );
};

export const AuthPrompt = Object.assign(_AuthPrompt, {
  viewConfig: defineView({
    component: _AuthPrompt,
    type: "full",
    title: "About",
    preview: SplitScreenPreview.Settings,
  }),
});

export default AuthPrompt;
