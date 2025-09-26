import styled from "styled-components";
import MyLogo from "../../components/Logo";
import { IoExitOutline } from 'react-icons/io5';
import { useContext, useState } from "react";
import apiPosts from "../../services/apiPosts";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";


export default function NewPost() {
    const [pictureUrl, setPictureUrl] = useState("");
    const [description, setDescription] = useState("");
    const { token } = useContext(UserContext);
    const navigate = useNavigate();

    function newPost(event) {
        event.preventDefault();

        const body = { pictureUrl, description };

        apiPosts.createPost(token, body)
            .then(res => {
                setPictureUrl("");
                setDescription("");
                navigate("/home-page");
            })
            .catch(err => {
                alert(err.response.data);
            })
    }

    return (
        <Page>
            <Top>
                <MyLogo />
                <Options>
                    <OptionLink  onClick={() => navigate("/home-page")}>Início</OptionLink>
                    <ExitIcon />
                </Options>
            </Top>
            <form onSubmit={newPost}>
                <h2>Novo Post</h2>
                <InputWrapper>
                    <input
                        type="url"
                        autoComplete="pictureUrl"
                        required
                        value={pictureUrl}
                        onChange={e => setPictureUrl(e.target.value)}
                    />
                    <label className={pictureUrl ? "filled" : ""}>Foto:</label>
                </InputWrapper>


                <InputWrapper $isBig={true}>
                    <TextArea
                        required
                        value={description}
                        autoComplete="description"
                        onChange={e => setDescription(e.target.value)}
                    />
                    <label className={description ? "filled" : ""}>Descrição:</label>
                </InputWrapper>

                <button type="submit">CRIAR POST</button>
            </form>

        </Page>
    );
};


const Page = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    flex-direction: column;

`;

const Top = styled.div`
    background-color: #dbe6f8ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    width: 100%;
    border: 1px solid #aec8f1ff;
    position: fixed;
    top: 0;
    left: 0;
`;

const Options = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    position: fixed;
    right: 60px;
    top: 20px;
`;
const OptionLink = styled.h5`
    cursor: pointer;
    color: ${props => props.$primary === false ? '#777' : ''};
`;

const ExitIcon = styled(IoExitOutline)`
  color: #0864f7;
  font-weight: 700;
  width: 30px;
  height: 30px;
  cursor: pointer; 
`;

const InputWrapper = styled.div`
    position: relative;
    width: 769px;
    height: ${props => props.$isBig ? "120px" : "60px"};
        textarea:focus + label {
        top: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #0864f7;
    }
`;

const TextArea = styled.textarea`
    box-sizing: border-box;
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: black;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border: 1px solid #aec8f1ff;
    padding: 20px 22px 0 22px;
    outline: none;
    resize: none; 
    &:focus { border-color: #0864f7; }
`;