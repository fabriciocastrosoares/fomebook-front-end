import { useContext, useState } from "react";
import apiPosts from "../../services/apiPosts";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { InputWrapper, OptionLink, Options, TextArea } from "../registrationAndLogin/styled";
import { ExitIcon, Page } from "../HomePage/styled";
import handleLogout from "../../utils/logic";
import styled from "styled-components";
import { UserImage } from "../AnotherUsersProfile/styled";
import { FacebookIcon, MyLogo, Topo } from "../timeline/styled";

export default function NewPost() {
    const { name, setName, token, setToken, image } = useContext(UserContext);
    const [pictureUrl, setPictureUrl] = useState("");
    const [description, setDescription] = useState("");
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
            <Topo>
                <UserImage src={image} alt={name} onClick={() => navigate("/home-page")} />
                <MyLogo onClick={() => navigate("/time-line")}>
                    <FacebookIcon />
                    <h1>omebook</h1>
                </MyLogo>
                <Options>
                    <OptionLink onClick={() => navigate("/time-line")}>Início</OptionLink>
                    <ExitIcon onClick={() => handleLogout(token, setName, setToken, navigate)} />
                </Options>
            </Topo>
            <ContainerPost>
                <form onSubmit={newPost}>
                    <h2>Novo Post</h2>
                    <InputWrapper>
                        <input
                            type="url"
                            placeholder=" "
                            autoComplete="pictureUrl"
                            required
                            value={pictureUrl}
                            onChange={e => setPictureUrl(e.target.value)}
                        />
                        <label>Foto:</label>
                    </InputWrapper>


                    <InputWrapper $isBig={true}>
                        <TextArea
                            placeholder=" "
                            required
                            value={description}
                            autoComplete="description"
                            onChange={e => setDescription(e.target.value)}
                        />
                        <label>Descrição:</label>
                    </InputWrapper>

                    <button type="submit">CRIAR POST</button>
                </form>

            </ContainerPost>


        </Page>
    );
};

const ContainerPost = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    gap: 25px;

    p{
        color: #0864f7;
        text-decoration: underline;
        cursor: pointer;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 90%;
        max-width: 600px;
    }

    form button {
        width: 90%;
        max-width: 400px;
        height: 60px;
        border: none;
        border-radius: 12px;
        background-color: #0864f7;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        cursor: pointer;
        outline: none;
        transition: background-color 0.2s ease;
    }
`;