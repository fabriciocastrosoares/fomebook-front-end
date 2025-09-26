import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import MyLogo from "../../components/Logo";
import { IoExitOutline } from 'react-icons/io5';
import apiFollwers from "services/apiFollwer";
import apiAuth from "../../services/apiAuth";

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
                // 1. Obter os dados do usuário logado para pegar o ID
                const userRes = await apiUsers.getUser(token);
                const userId = userRes.data.id;

                // 2. Com o ID, buscar a lista de seguidores
                const followersRes = await apiFollwers.getFollowers(token, userId);
                setFollowers(followersRes.data || []);

            } catch (err) {
                console.error(err.response?.data || err.message);
                alert("Não foi possível carregar a lista de seguidores.");
            }
        };
        fetchFollowersData();
    }, [token, navigate]);

      function handleLogout() {
        apiAuth.logout(token)
            .then(() => {
                setName(undefined);
                setToken(undefined);
                localStorage.clear();
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
                    <OptionLink onClick={() => navigate("/home-page")}>Início</OptionLink>
                    <ExitIcon onClick={handleLogout} />
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

const Page = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Top = styled.header`
    background-color: #dbe6f8ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    width: 100%;
    border-bottom: 1px solid #aec8f1ff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
`;

const Options = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 60px;
`;
const OptionLink = styled.h5`
    cursor: pointer;
`;

const ExitIcon = styled(IoExitOutline)`
  color: #0864f7;
  font-size: 30px;
  cursor: pointer; 
`;

const Container = styled.main`
    margin-top: 120px;
    width: 100%;
    max-width: 600px;
    h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }
`;

const UserList = styled.ul`
    list-style: none;
`;

const UserItem = styled.li`
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-radius: 8px;
    &:hover { background-color: #f0f2f5; }
    img { width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; }
    span { font-size: 18px; }
`;