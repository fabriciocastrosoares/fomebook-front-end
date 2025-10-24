import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAuth from "../../services/apiAuth";
import { Page, Left, InputWrapper, TextArea, ContanerLogin } from "./styled";
import Logo from "../../components/LogoAndSlogan";

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
            <Left>
                <Logo />
            </Left>

            <ContanerLogin>
                <form onSubmit={createAcount}>
                    <h2>Cadastro</h2>
                    <InputWrapper>
                        <input
                            type="text"
                            placeholder=" "
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <label>Nome:</label>
                    </InputWrapper>

                    <InputWrapper>
                        <input
                            type="email"
                            autoComplete="username"
                            placeholder=" "
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label>E-mail:</label>
                    </InputWrapper>

                    <InputWrapper>
                        <input
                            type="url"
                            autoComplete="imageUrl"
                            placeholder=" "
                            required
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                        />
                        <label>Foto de Perfil:</label>
                    </InputWrapper>

                    <InputWrapper $isBig={true}>
                        <TextArea
                            placeholder=" "
                            required
                            value={biography}
                            autoComplete="biography"
                            onChange={e => setBiography(e.target.value)}
                        />
                        <label>Biografia:</label>
                    </InputWrapper>

                    <InputWrapper>
                        <input
                            type="password"
                            autoComplete="new-password"
                            placeholder=" "
                            required
                            minLength={3}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label>Senha:</label>
                    </InputWrapper>

                    <InputWrapper>
                        <input
                            type="password"
                            autoComplete="new-password"
                            placeholder=" "
                            required
                            minLength={3}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <label>Confirmar a Senha:</label>
                    </InputWrapper>

                    <button type="submit">CRIAR CONTA</button>
                    <p onClick={() => navigate("/")}>Voltar para fazer login</p>
                </form>
            </ContanerLogin>

        </Page>

    );
};
