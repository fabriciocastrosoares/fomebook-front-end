import MyLogo from "../../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import dayjs from 'dayjs';
import { Top, Options } from "../registrationAndLogin/styled";
import {
    Page, AddPostIcon, ChatBubbleIcon, DateContainer, Description, ExitIcon,
    FollowStats, IoHeartFilledStyled, IoHeartOutlineStyled, LikeAndDate,
    LikeImage, MyPage, MyPosts, NameBio, PostImage, SearchContainer, SearchIcon,
    SearchInput, SearchResultItem, SearchResultsList, SearchWrapper, Stat, Tooltip, UserImage,
    EditImage, ImageAndIcon, Pencil, PostPencil, PostTrash, CommentIcon,
    RepostIconContainer, RepostIcon
} from "./styled";
import handleLogout from "../../utils/logic";
import handleLike from "../../utils/likesAndUnlikes";
import EditModal from "../../components/EditModal";
import deletePost from "../../utils/deletePost";
import apiPosts from "../../services/apiPosts";
import CommentSection from "../../components/commentSection";
import RepostModal from "../../components/RepostModal";

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const { name, setName, token, setToken } = useContext(UserContext);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editType, setEditType] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
    const [postToRepost, setPostToRepost] = useState(null);
    const [isReposting, setIsReposting] = useState(false);

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

    const handleMouseLeave = () => {
        setHoveredPostId(null);
    };

    const handleCommentPosted = (postId, newComment) => {
        setPosts(currentPosts =>
            currentPosts.map(post => {
                if (post.id === postId) {
                    const commentWithUser = {
                        ...newComment,
                        user: {
                            id: loggedInUser.id,
                            name: loggedInUser.name,
                            imageUrl: loggedInUser.imageUrl,
                        },
                    };
                    const updatedComments = [...(post.comments || []), commentWithUser];
                    return { ...post, comments: updatedComments, commentCount: updatedComments.length };
                }
                return post;
            })
        );
    };

    const handleRepost = async () => {
        if (!postToRepost || isReposting) return;
        setIsReposting(true);
        try {
            await apiPosts.repostPost(token, postToRepost.id);
            setPosts(currentPosts => currentPosts.map(p =>
                p.id === postToRepost.id ? { ...p, repostCount: (p.repostCount || 0) + 1 } : p
            ));
            setIsRepostModalOpen(false);
            setPostToRepost(null);
        } catch (error) {
            console.error("Error reposting:", error);
            alert("Could not repost. Please try again.");
        } finally {
            setIsReposting(false);
        }
    };


    return (
        <Page>
            <Top>
                <MyLogo onClick={() => navigate("/time-line")} />
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
                                            }}>
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
                    <ImageAndIcon>
                        <UserImage src={loggedInUser.imageUrl} alt="Foto do usuário" />
                        <EditImage onClick={() => { setIsModalOpen(true); setEditType("image"); }} />
                    </ImageAndIcon>

                    <NameBio>
                        <h3>Bem-vindo(a), {loggedInUser.name} <Pencil onClick={() => { setIsModalOpen(true); setEditType("name"); }} /> </h3>
                        <h4>{loggedInUser.biography} <Pencil onClick={() => { setIsModalOpen(true); setEditType("bio"); }} /> </h4>
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
                    <PostPencil onClick={() => {
                        setIsModalOpen(true);
                        setEditType("post");
                        setPostToDelete(p.id);
                    }} />
                    <PostTrash onClick={() => {
                        setIsModalOpen(true);
                        setEditType("deletePost");
                        setPostToDelete(p.id);
                    }} />
                    <PostImage src={p.pictureUrl} alt="Foto do post" />
                    <LikeAndDate>
                        <LikeImage onMouseEnter={() => setHoveredPostId(p.id)} onMouseLeave={handleMouseLeave}>
                            {p.likedByUser ? (
                                <IoHeartFilledStyled onClick={() => handleLike(p.id, p.likedByUser, token, setPosts)} />
                            ) : (
                                <IoHeartOutlineStyled onClick={() => handleLike(p.id, p.likedByUser, token, setPosts)} />
                            )}
                            <p>{p.likeCount} {p.likeCount === 1 ? "pessoa curtiu" : "pessoas curtiram"} sua foto!</p>

                            {hoveredPostId === p.id && p.likeCount > 0 && (
                                <Tooltip>  
                                    {(() => {
                                        const otherLikers = (Array.isArray(p.likers) ? p.likers : JSON.parse(p.likers || '[]'))
                                            .filter(name => name !== loggedInUser.name);
                                        const namesToShow = [];
                                        if (p.likedByUser) {
                                            namesToShow.push("Você");
                                        }
                                        namesToShow.push(...otherLikers.slice(0, 2));

                                        const totalLikes = p.likeCount;
                                        const displayedNamesCount = namesToShow.length;
                                        const remainingLikes = totalLikes - displayedNamesCount;

                                        let text = namesToShow.join(', ');

                                        if (remainingLikes > 0) {
                                            text += ` e mais ${remainingLikes} pessoa${remainingLikes > 1 ? 's' : ''}`;
                                        }
                                        return <span>{text}</span>;
                                    })()}
                                </Tooltip>
                            )}
                        </LikeImage>
                        <CommentIcon onClick={() => setActiveCommentPostId(activeCommentPostId === p.id ? null : p.id)}>
                            <ChatBubbleIcon />
                            <p>
                                {p.comments?.length || 0}{' '}
                                {p.comments?.length === 1 ? 'comentário' : 'comentários'}
                            </p>
                        </CommentIcon>
                        <RepostIconContainer onClick={() => {
                            setPostToRepost(p);
                            setIsRepostModalOpen(true);
                        }}>
                            <RepostIcon />
                            <p>{p.repostCount || 0} re-posts</p>
                        </RepostIconContainer>
                        <DateContainer>
                            <p>{dayjs(p.createdAt).format("DD/MM/YYYY [às] HH[h]mm")}</p>
                        </DateContainer>
                    </LikeAndDate>
                    <Description>
                        <p>{p.description}</p>
                    </Description>
                    {activeCommentPostId === p.id && (
                        <CommentSection
                            postId={p.id}
                            comments={p.comments || []}
                            userImage={loggedInUser.imageUrl}
                            postAuthorId={loggedInUser.id}
                            followingIds={(loggedInUser.following || []).map(f => f.id)}
                            token={token}
                            onCommentPosted={handleCommentPosted}
                        />
                    )}  
                </MyPosts>  
            ))}

            <Link to="/new-post">
                <AddPostIcon />
            </Link>
            <RepostModal
                isOpen={isRepostModalOpen}
                onClose={() => setIsRepostModalOpen(false)}
                onConfirm={handleRepost}
                isReposting={isReposting}
            />
            <EditModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPostToDelete(null);
                }}
                type={editType}
                onConfirm={async (newValue) => {
                    try {
                        if (editType === "deletePost" && postToDelete) {
                            deletePost(postToDelete, token, setPosts, setIsModalOpen, setPostToDelete);
                            return;
                        }
                        if (["image", "name", "bio", "post"].includes(editType)) {
                            if (editType === "post") {
                                const body = { description: newValue };

                                try {
                                    await apiPosts.updatePosts(token, postToDelete, body);
                                    setPosts(prev =>
                                        prev.map(p => (p.id === postToDelete ? { ...p, description: newValue } : p))
                                    );

                                    setIsModalOpen(false);
                                    setPostToDelete(null);
                                } catch (err) {
                                    console.error("Erro ao atualizar post:", err.response?.data || err.message);
                                }
                                return;
                            }
                            const body = {};
                            if (editType === "image") body.imageUrl = newValue;
                            if (editType === "name") body.name = newValue;
                            if (editType === "bio") body.biography = newValue;

                            try {
                                const res = await apiUsers.updateUser(token, loggedInUser.id, body);
                                setLoggedInUser(res.data);
                                setIsModalOpen(false);
                            } catch (err) {
                                console.error("Erro ao atualizar usuário:", err.response?.data || err.message);
                            }
                        }

                    } catch (err) {
                        console.error("Erro ao atualizar usuário:", err.response?.data || err.message);
                    }
                }} 
            />         
        </Page>
        
    );
};
