import styled from "styled-components";
import MyLogo from "../components/Logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAuth from "../services/apiAuth";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [biography, setBiography] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

        function createAcount(e) {
        e.preventDefault();

        if (password !== confirmPassword) return alert("As senhas devem ser iguais!");

        const body = { name, email, imageUrl, biography, password, confirmPassword };

        apiAuth.signup(body)
            .then(res => {
                alert("cadastro realizado com suscesso")
                navigate("/");
            })
            .catch(err => {
                alert(err.response.data);
            })
    };

    return (
        <Page>
            <Top>
                <MyLogo />
                <Options>
                    <OptionLink onClick={() => navigate("/")} $primary={false}>Entrar</OptionLink>
                    <OptionLink onClick={() => navigate("/signup-page")}>Cadastrar-se</OptionLink>
                </Options>
            </Top>

            <form onSubmit = {createAcount}>
                <h2>Cadastro</h2>
                <InputWrapper>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <label className={name ? "filled" : ""}>Nome:</label>
                </InputWrapper>

                <InputWrapper>
                    <input
                        type="email"
                        autoComplete="username"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label className={email ? "filled" : ""}>E-mail:</label>
                </InputWrapper>

                <InputWrapper>
                    <input
                        type="url"
                        autoComplete="imageUrl"
                        required
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                    />
                    <label className={imageUrl ? "filled" : ""}>Foto de Perfil:</label>
                </InputWrapper>

                <InputWrapper $isBig={true}>
                    <TextArea
                        required
                        value={biography}
                        autoComplete="biography"
                        onChange={e => setBiography(e.target.value)}
                    />
                    <label className={biography ? "filled" : ""}>Biografia:</label>
                </InputWrapper>

                <InputWrapper>
                    <input
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={3}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label className={password ? "filled" : ""}>Senha:</label>
                </InputWrapper>

                <InputWrapper>
                    <input
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={3}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <label className={confirmPassword ? "filled" : ""}>Confirmar a Senha:</label>
                </InputWrapper>

                <button type = "submit">CRIAR CONTA</button>
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
    justify-content: space-between;
    gap: 20px;
    position: fixed;
    right: 60px;
    top: 20px;
`;

const OptionLink = styled.h5`
    cursor: pointer;
    color: ${props => props.$primary === false ? '#777' : '#0864f7'};
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