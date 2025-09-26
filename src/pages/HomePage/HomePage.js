import styled from "styled-components";
import MyLogo from "../../components/Logo";
import { IoHeart, IoHeartOutline, IoSearchOutline, IoAddCircle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { IoExitOutline } from 'react-icons/io5';
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import apiPosts from "../../services/apiPosts";
import formatPostDate from "utils/formatPostdate";
import apiAuth from "services/apiAuth";


export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const { name, setName, token, setToken } = useContext(UserContext);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

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

    useEffect(() => {
        if (!token || !name) navigate("/");
        getUserPosts();
    }, []);

    function getUserPosts() {
        apiUsers.getUser(token)
            .then(res => {
                setLoggedInUser(res.data);

            })
            .catch(er => {
                alert(er.response.data);
            })
    };

    useEffect(() => {
        if (searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }

        const debouncedSearch = setTimeout(() => {
            apiUsers.searchUsers(token, searchQuery)
                .then(res => {
                    setSearchResults(res.data);
                })
                .catch(err => {
                    console.error("Erro ao buscar usuários:", err.response?.data || err.message);
                    setSearchResults([]);
                });
        }, 300);

        return () => clearTimeout(debouncedSearch);
    }, [searchQuery, token, navigate]);

    async function handleLike(postId, isLiked) {
        try {
            if (isLiked) {
                await apiPosts.dislikePost(token, postId);
            } else {
                await apiPosts.likePost(token, postId);
            }
            // Após a ação, busca os dados do usuário novamente para garantir a sincronia
            getUserPosts();
        } catch (err) {
            alert("Não foi possível curtir/descurtir o post. Tente novamente.");
            console.error(err.response?.data || err.message);
            // Em caso de erro, recarrega os dados para reverter a UI para o estado real
            getUserPosts();
        }
    }

    return (
        <Page>
            <Top>
                <MyLogo />
                <Options>
                    <SearchWrapper>
                        <SearchContainer>
                            <SearchInput
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar usuário..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <SearchIcon />
                        </SearchContainer>

                        {searchQuery.length >= 3 && (
                            <SearchResultsList>
                                {searchResults.length > 0 ? (
                                    searchResults.map(user => (
                                        <SearchResultItem
                                            key={user.id}
                                            onMouseDown={() => {
                                                if (loggedInUser && user.id === loggedInUser.id) {
                                                    return; // Não faz nada se for o perfil do próprio usuário
                                                }
                                                navigate(`/users/${user.id}`); // Navega para o perfil de outro usuário
                                                setSearchQuery("");
                                                searchInputRef.current.blur();
                                            }}
                                        >
                                            <img src={user.imageUrl} alt={user.name} />
                                            <span>{user.name}</span>
                                        </SearchResultItem>
                                    ))
                                ) : (
                                    <SearchResultItem as="div" $unclickable={true}>
                                        <span>Nenhum usuário encontrado...</span>
                                    </SearchResultItem>
                                )}
                            </SearchResultsList>
                        )}
                    </SearchWrapper>
                    <ExitIcon onClick={handleLogout} />
                </Options>
            </Top>
            {loggedInUser && (
                <MyPage>
                    <UserImage src={loggedInUser.imageUrl} alt="Foto do usuário" />
                    <NameBio>
                        <h3>Bem-vindo(a), {loggedInUser.name}</h3>
                        <h4>{loggedInUser.biography}</h4>
                        <FollowStats>
                            <Stat onClick={() => navigate("/my-followers")}>
                                <strong>Ver Seguidores</strong> 
                            </Stat>
                            <Stat onClick={() => navigate("/following")}>
                                <strong>Ver quem eu Sigo</strong> 
                            </Stat>
                        </FollowStats>
                    </NameBio>
                </MyPage>
            )}

            {loggedInUser && loggedInUser.posts.map((p) => {
                const likedByArray = p.likedBy || [];
                const isLiked = likedByArray.some(like => like.userId === loggedInUser.id);
                const likeCount = likedByArray.length;

                return (
                    <MyPosts key={p.id}>
                        <PostImage src={p.pictureUrl} alt="Foto do post" />
                        <LikeAndDate>
                            <LikeImage onClick={() => handleLike(p.id, isLiked)}>
                                {isLiked ? <IoHeartFilled /> : <IoHeartOutlineStyled />}
                                <p>{likeCount} {likeCount === 1 ? "pessoa curtiu" : "pessoas curtiram"} sua foto!</p>
                            </LikeImage>
                            <DateContainer>
                                <p>{formatPostDate(p.createdAt)}</p>
                            </DateContainer>
                        </LikeAndDate>
                        <Descrption>
                            <p>{p.description}</p>
                        </Descrption>
                    </MyPosts>
                );
            })}

            <Link to="/new-post">
                <AddPostIcon />
            </Link>

        </Page>
    );
};


const Page = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const MyPage = styled.div`
    border: 1px solid #aec8f1ff;
    width: 100vh;
    height: 10vw;
    margin-top: 130px;
    display: flex;
    align-items: center;
    justify-content: space-around;
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
    align-items: center;
    gap: 20px;
    position: fixed;
    right: 60px;
    top: 20px;
`;

const SearchWrapper = styled.div`
    position: relative;
`;

const SearchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    height: 40px;
    width: 250px;
    border-radius: 8px;
    border: 1px solid #aec8f1ff;
    padding: 0 40px 0 15px; /* Espaço para o ícone à direita */
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease-in-out;
`;

const SearchIcon = styled(IoSearchOutline)`
    color: #0864f7;
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
`;

const ExitIcon = styled(IoExitOutline)`
  color: #0864f7;
  font-weight: 700;
  width: 30px;
  height: 30px;
  cursor: pointer; 
`;

const SearchResultsList = styled.ul`
    position: absolute;
    top: 50px; 
    left: 0;
    width: 250px;
    background-color: #e7e7e7;
    border-radius: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 10;
`;

const SearchResultItem = styled.li`
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: ${props => props.$unclickable ? 'default' : 'pointer'};

    &:hover {
        background-color: #dbe6f8ff;
    }

    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    span { font-size: 16px; color: #333; }
`;

const UserImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover; 
    border: 1px solid #aec8f1ff;
`;

const NameBio = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 10vw;
    padding: 20px;
`;

const FollowStats = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
`;

const Stat = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: 150px;
    height: 30px;
    color: #0864f7;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #aec8f1ff;
    &:hover {
        color: #0864f7;
    }
    strong {
        font-weight: bold;
    }
`;
const MyPosts = styled.div`
    border: 1px solid #aec8f1ff;
    width: 100vh;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const PostImage = styled.img`
    height: 30vw;
    padding: 20px;
`;

const LikeAndDate = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const LikeImage = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 20px;
    gap: 5px;
`;

const IoHeartOutlineStyled = styled(IoHeartOutline)`
    width: 30px;
    height: 30px;
    color: #0864f7;
`;

const IoHeartFilled = styled(IoHeart)`
    width: 30px;
    height: 30px;
    color: #ff4b4b;
`;

const DateContainer = styled.div`
    margin-right: 20px;
`;

const AddPostIcon = styled(IoAddCircle)`
    color: #0864f7;
    width: 50px;
    height: 50px;
    position: fixed;
    top: 800px;
    right: 300px;
`;
const Descrption = styled.div`
    margin-left: 25px;
    margin-top: 20px;
`;