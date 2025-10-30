import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import apiAuth from "../../services/apiAuth";
import { Page, InputWrapper, Left, ContanerLogin } from "./styled";
import Logo from "../../components/LogoAndSlogan";


export default function SigninPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setName, setToken, setImage } = useContext(UserContext);
    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();

        const body = { email, password };

        apiAuth.signin(body)
            .then(res => {
                setName(res.data.name);
                setToken(res.data.token);
                setImage(res.data.image)
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("name", res.data.name);
                localStorage.setItem("image", res.data.image);
                navigate("/time-line")
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
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <InputWrapper>
                        <input
                            type="email"
                            placeholder=" "
                            autoComplete="username"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label>E-mail:</label>
                    </InputWrapper>

                    <InputWrapper>
                        <input
                            type="password"
                            placeholder=" "
                            autoComplete="new-password"
                            required
                            minLength={3}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label>Senha:</label>
                    </InputWrapper>

                    <button type="submit">ENTRAR</button>
                    <p onClick={() => navigate("/signup-page")}>Primeira vez? Clique aqui e crie uma conta!</p>
                </form>
            </ContanerLogin>

        </Page>
    );
};
