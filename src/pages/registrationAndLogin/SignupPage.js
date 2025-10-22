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

                    <button type="submit">CRIAR CONTA</button>
                    <p onClick={() => navigate("/")}>Voltar para fazer login</p>
                </form>
            </ContanerLogin>

        </Page>

    );
};

