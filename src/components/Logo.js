import styled from "styled-components";
import { FaFacebookF } from "react-icons/fa6";

export default function Logo() {
    return (
            <MyLogo>
                <FacebookIcon />
                <h1>omebook</h1>
            </MyLogo>
    );
};



const MyLogo = styled.div`
    display: flex;   
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 60px;
    color: #0864f7;
    
`;

const FacebookIcon = styled(FaFacebookF)`
    margin-left: 60px;
    margin-right: -10px;
    font-size: 60px;
`;



