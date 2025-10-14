import MyLogo from "../../components/Logo";
import { useContext, useState } from "react";
import apiPosts from "../../services/apiPosts";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { InputWrapper, OptionLink, Options, Page, TextArea, Top } from "../registrationAndLogin/styled";
import { ExitIcon } from "../HomePage/styled";
import handleLogout from "../../utils/logic";

export default function NewPost() {
    const { setName, token, setToken } = useContext(UserContext);
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
            <Top>
                <MyLogo />
                <Options>
                    <OptionLink  onClick={() => navigate("/home-page")}>Início</OptionLink>
                    <ExitIcon onClick={()=> handleLogout(token, setName, setToken, navigate)}/>
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