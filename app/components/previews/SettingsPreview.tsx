import { motion } from "motion/react";
import styled from "styled-components";
import { Unit } from "@/utils/constants";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 ${Unit.SM};
  color: white;
  text-align: center;
  background: linear-gradient(180deg, #b1b5c0 0%, #686e7a 100%);
`;

const Image = styled.img`
  height: 3.5em;
  width: 3.5em;
  margin-bottom: ${Unit.XS};
  border-radius: 8px;
`;

const Text = styled.h3`
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
`;

const Subtext = styled.p`
  margin: 0;
  font-size: 11px;
  opacity: 0.85;
  line-height: 1.3;
`;

const SettingsPreview = () => {
  return (
    <Container>
      <Image alt="ZKR logo" src="/logo/zkr-pure-white-on-dark.png" />
      <Text>ZKR iPod</Text>
      <Subtext>Designed & developed by ZKR</Subtext>
    </Container>
  );
};

export default SettingsPreview;
