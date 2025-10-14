import MyLogo from "../../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import dayjs from 'dayjs';
import { Page, Top, Options } from "../registrationAndLogin/styled";
import { AddPostIcon, DateContainer, Description, ExitIcon, FollowStats, IoHeartFilledStyled, IoHeartOutlineStyled, LikeAndDate, LikeImage, MyPage, MyPosts, NameBio, PostImage, SearchContainer, SearchIcon, SearchInput, SearchResultItem, SearchResultsList, SearchWrapper, Stat, UserImage } from "./styled";
import handleLogout from "../../utils/logic";
import handleLike from "../../utils/likesAndUnlikes";

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const { name, setName, token, setToken } = useContext(UserContext);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (!token || !name) {
            navigate("/");
            return;
        }

        async function getUserPosts() {
            if (!token) return;
            try {
                const res = await apiUsers.getUser(token);
                setLoggedInUser(res.data);
                setPosts(res.data.posts || []);
            } catch (er) {
                console.error(er.response?.data || er.message);
                if (er.response?.status === 401) {
                    setName(undefined);
                    setToken(undefined);
                    localStorage.clear();
                    navigate("/");
                }
            }
        }

        getUserPosts();
    }, [token, name, navigate, setName, setToken]);

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
    }, [searchQuery, token]);

    return (
        <Page>
            <Top>
                <MyLogo onClick={() => navigate("/home-page")} />
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
                                                if (loggedInUser && user.id === loggedInUser.id) return;
                                                navigate(`/users/${user.id}`);
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
                    <ExitIcon onClick={() => handleLogout(token, setName, setToken, navigate)} />
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

            {posts.map((p) => (
                <MyPosts key={p.id}>
                    <PostImage src={p.pictureUrl} alt="Foto do post" />
                    <LikeAndDate>
                        <LikeImage>
                            {p.likedByUser ? (
                                <IoHeartFilledStyled onClick={() => handleLike(p.id, p.likedByUser, token, setPosts)} />
                            ) : (
                                <IoHeartOutlineStyled onClick={() => handleLike(p.id, p.likedByUser, token, setPosts)} />
                            )}
                            <p>{p.likeCount} {p.likeCount === 1 ? "pessoa curtiu" : "pessoas curtiram"} sua foto!</p>
                        </LikeImage>
                        <DateContainer>
                            <p>{dayjs(p.createdAt).format("DD/MM/YYYY [às] HH[h]mm")}</p>
                        </DateContainer>
                    </LikeAndDate>
                    <Description>
                        <p>{p.description}</p>
                    </Description>
                </MyPosts>
            ))}

            <Link to="/new-post">
                <AddPostIcon />
            </Link>
        </Page>
    );
};
