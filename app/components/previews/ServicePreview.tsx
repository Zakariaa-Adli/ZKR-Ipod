import { motion } from "motion/react";
import { useSettings } from "@/hooks";
import styled from "styled-components";
import { Unit } from "@/utils/constants";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  background: linear-gradient(180deg, #b1b5c0 0%, #686e7a 100%);
`;

const Image = styled.img`
  height: 6em;
  width: 6em;
  margin: ${Unit.XS};
`;

const Text = styled.h3`
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 600;
`;

const Subtext = styled(Text)`
  font-size: 14px;
  font-weight: 400;
`;

const strings = {
  local: "Local Music",
  none: "None",
  selected: "Selected service",
};

const ServicePreview = () => {
  const { service } = useSettings();

  // Show local music icon
  const imgUrl = "/logo/zkr-pure-white-on-dark.png";

  const text = strings[service ?? "none"];

  return (
    <Container>
      <Image alt="Local Music" src={imgUrl} />
      <Text>{text}</Text>
      <Subtext>{strings.selected}</Subtext>
    </Container>
  );
};

export default ServicePreview;