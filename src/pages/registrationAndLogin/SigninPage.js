import { useContext, useState } from "react";
import MyLogo from "../../components/Logo";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import apiAuth from "../../services/apiAuth";
import { Page, Top, Options, OptionLink, InputWrapper } from "./styled";


export default function SigninPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setName, setToken } = useContext(UserContext);
    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();

        const body = { email, password };

        apiAuth.signin(body)
            .then(res => {
                setName(res.data.name);
                setToken(res.data.token);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("name", res.data.name);
                navigate("/home-page")
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
                    <OptionLink onClick={() => navigate("/")}>Entrar</OptionLink>
                    <OptionLink onClick={() => navigate("/signup-page")} $primary={false}>Cadastrar</OptionLink>
                </Options>
            </Top>

            <form onSubmit={handleLogin}>
                <h2>Login</h2>
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
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={3}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label className={password ? "filled" : ""}>Senha:</label>
                </InputWrapper>

                <button type = "submit">ENTRAR</button>
            </form>
        </Page>
    );
};


