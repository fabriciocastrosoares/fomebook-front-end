import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import MyLogo from "../../components/Logo";
import apiFollowers from "../../services/apiFollowers";
import { OptionLink, Options, Top } from "../registrationAndLogin/styled";
import { ExitIcon, Page } from "../HomePage/styled";
import { Container, UserItem, UserList } from "./styled";
import handleLogout from "../../utils/logic";

export default function MyFollowersPage() {
    const [followers, setFollowers] = useState([]);
    const { setName, token, setToken } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const fetchFollowersData = async () => {
            try {
                const userRes = await apiUsers.getUser(token);
                const userId = userRes.data.id;

                const followersRes = await apiFollowers.getFollowers(token, userId);
                setFollowers(followersRes.data || []);

            } catch (err) {
                console.error(err.response?.data || err.message);
                alert("Não foi possível carregar a lista de seguidores.");
            }
        };
        fetchFollowersData();
    }, [token, navigate]);

    return (
        <Page>
            <Top>
                <MyLogo onClick={() => navigate("/home-page")}/>
                <Options>
                    <OptionLink onClick={() => navigate("/home-page")}>Início</OptionLink>
                    <ExitIcon onClick={()=> handleLogout(token, setName, setToken, navigate)} />
                </Options>
            </Top>
            <Container>
                <h1>Meus Seguidores</h1>
                {followers.length > 0 ? (
                    <UserList>
                        {followers.map(f => (
                            <UserItem key={f.id} onClick={() => navigate(`/users/${f.id}`)}>
                                <img src={f.imageUrl} alt={f.name} />
                                <span>{f.name}</span>
                            </UserItem>
                        ))}
                    </UserList>
                ) : (
                    <p>Você ainda não tem seguidores.</p>
                )}
            </Container>
        </Page>
    );
};
