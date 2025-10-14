import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import MyLogo from "../../components/Logo";
import apiFollowers from "../../services/apiFollowers";
import { OptionLink, Options, Page, Top } from "../registrationAndLogin/styled";
import { ExitIcon } from "../HomePage/styled";
import { Container, UserItem, UserList } from "./styled";
import handleLogout from "../../utils/logic";

export default function FollowingPage() {
    const [following, setFollowing] = useState([]);
    const { setName, token, setToken } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const fetchFollowingData = async () => {
            try {
                const userRes = await apiUsers.getUser(token);
                const userId = userRes.data.id;
                
                const followingRes = await apiFollowers.getFollowing(token, userId);
                setFollowing(followingRes.data || []);

            } catch (err) {
                console.error(err.response?.data || err.message);
                alert("Não foi possível carregar a lista de usuários que você segue.");
            }
        };
        fetchFollowingData();
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
                <h1>Quem você segue</h1>
                {following.length > 0 ? (
                    <UserList>
                        {following.map(f => (
                            <UserItem key={f.id} onClick={() => navigate(`/users/${f.id}`)}>
                                <img src={f.imageUrl} alt={f.name} />
                                <span>{f.name}</span>
                            </UserItem>
                        ))}
                    </UserList>
                ) : (
                    <p>Você ainda não segue ninguém.</p>
                )}
            </Container>
        </Page>
    );
};