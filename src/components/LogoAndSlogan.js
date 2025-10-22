import styled from "styled-components";
import { FaFacebookF } from "react-icons/fa6";

export default function Logo() {
  return (
    <LogoContainer >
      <LogoRow>
        <FacebookIcon />
        <LogoText>omebook</LogoText>
      </LogoRow>
      <Slogan>Cozinhe, coma, compartilhe e seja feliz!</Slogan>
    </LogoContainer>
  );
}

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #0864f7;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: baseline; 
`;

const FacebookIcon = styled(FaFacebookF)`
  font-size: 60px;
  color: #0864f7;
  transform: translateY(4px); 
  margin-left: -10px;
`;

const LogoText = styled.h1`
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 700;
  font-size: 60px;
  color: #0864f7;
  margin-left: -10px;
`;

const Slogan = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #0864f7;
  margin-top: 8px;
  text-align: center;
`;
