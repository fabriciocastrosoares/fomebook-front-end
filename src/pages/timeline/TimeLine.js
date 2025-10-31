import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import useInterval from 'use-interval';
import { UserContext } from "../../contexts/UserContext";
import dayjs from "dayjs";
import { OptionLink, Options } from "../registrationAndLogin/styled";
import { AddPostIcon, ChatBubbleIcon, CommentIcon, DateContainer, Description, ExitIcon, LikeAndDate, Page, PostImage, SearchContainer, SearchIcon, SearchInput, SearchResultItem, SearchResultsList, SearchWrapper, Tooltip } from "../HomePage/styled";
import { LikeImage, IoHeartFilledStyled, IoHeartOutlineStyled, UserImage } from "../AnotherUsersProfile/styled";
import handleLogout from "../../utils/logic";
import apiPosts from "../../services/apiPosts";
import apiUsers from "../../services/apiUsers";
import CommentSection from "../../components/commentSection";
import { AuthorInfo, ContainerPosts, FacebookIcon, MyLogo, MyPosts, Topo, NewPostsButton, RepostBanner } from "./styled";
import { RepostIcon, RepostIconContainer } from "../HomePage/styled";
import RepostModal from "../../components/RepostModal";

export default function TimeLine() {
    const { name, setName, token, setToken, image } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [likeLoading, setLikeLoading] = useState(false);
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [newPosts, setNewPosts] = useState([]);
    const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
    const [postToRepost, setPostToRepost] = useState(null);
    const [isReposting, setIsReposting] = useState(false);
    const searchInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const { data: timelinePosts } = await apiPosts.getTimeLine(token);

            const formattedPosts = timelinePosts.map(post => {
                const formattedComments = (post.comments || []).map(comment => ({
                    id: comment.id,
                    text: comment.text,
                    createdAt: comment.createdAt,
                    user: {
                        id: comment.userId,
                        name: comment.userName,
                        imageUrl: comment.userImage
                    }
                }));

                return {
                    id: post.postId,
                    pictureUrl: post.pictureUrl,
                    description: post.description,
                    createdAt: post.createdAt,
                    repostedBy: post.repostedBy,
                    repostCount: post.repostCount,
                    likeCount: Number(post.likeCount),
                    likers: post.likers,
                    likedByUser: post.likedByUser,
                    comments: formattedComments,
                    commentCount: post.commentCount || 0,
                    author: {
                        id: post.userId,
                        name: post.userName,
                        imageUrl: post.userImage,
                    }
                };
            });

            setPosts(formattedPosts);
        } catch (err) {
            alert("Não foi possível carregar os dados. Tente novamente.");
            console.error(err.response?.data || err.message);
            navigate("/home-page");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!token || !name) {
            navigate("/");
            return;
        }
        fetchData().finally(() => setLoading(false));
    }, [token, name, navigate, fetchData]);

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

    useInterval(async () => {
        if (!token) return;
        try {
            const { data: timelinePosts } = await apiPosts.getTimeLine(token);
            const currentPostIds = new Set(posts.map(p => p.id));
            const incomingPosts = timelinePosts.map(post => ({
                id: post.postId,
                pictureUrl: post.pictureUrl,
                description: post.description,
                createdAt: post.createdAt,
                likeCount: Number(post.likeCount),
                likers: post.likers,
                likedByUser: post.likedByUser,
                comments: (post.comments || []).map(comment => ({
                    id: comment.id,
                    text: comment.text,
                    createdAt: comment.createdAt,
                    user: {
                        id: comment.userId,
                        name: comment.userName,
                        imageUrl: comment.userImage
                    }
                })),
                commentCount: post.commentCount || 0,
                author: {
                    id: post.userId,
                    name: post.userName,
                    imageUrl: post.userImage,
                }
            })).filter(p => !currentPostIds.has(p.id));

            if (incomingPosts.length > 0) {
                setNewPosts(prev => [...incomingPosts, ...prev.filter(np => !incomingPosts.some(ip => ip.id === np.id))]);
            }
        } catch (error) {
            console.error("Error checking for new posts:", error);
        }
    }, 15000);

    async function handleLikeInTimeline(postId, likedByUser) {
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            const action = likedByUser ? apiPosts.dislikePost : apiPosts.likePost;
            await action(token, postId);
            await fetchData();
        } catch (error) {
            console.error("Erro ao curtir/descurtir o post:", error);
            alert("Não foi possível realizar a ação. Tente novamente.");
        }
        setLikeLoading(false);
    }

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
                            imageUrl: image,
                        },
                    };
                    const updatedComments = [...(post.comments || []), commentWithUser];
                    return { ...post, comments: updatedComments, commentCount: updatedComments.length };
                }
                return post;
            })
        );
    };

    const loadNewPosts = () => {
        setPosts(prev => [...newPosts, ...prev]);
        setNewPosts([]);
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
    const [loggedInUser, setLoggedInUser] = useState(null);
    useEffect(() => {
        if (token) {
            apiUsers.getUser(token).then(res => setLoggedInUser(res.data));
        }
    }, [token]);

    if (loading) {
        return (
            <Page>
                <p>Carregando timeline...</p>
            </Page>
        );
    }

    return (
        <Page>
            <Topo>
                <UserImage src={image} alt={name} onClick={() => navigate("/home-page")} />
                <MyLogo onClick={() => navigate("/time-line")}>
                    <FacebookIcon />
                    <h1>omebook</h1>
                </MyLogo>
                <Options>
                    
                        <SearchWrapper >
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
                   
                    <OptionLink onClick={() => navigate("/home-page")}>Meu Perfil</OptionLink>
                    <ExitIcon onClick={() => handleLogout(token, setName, setToken, navigate)} />
                </Options>
            </Topo>


            <ContainerPosts>
                {newPosts.length > 0 && (
                    <NewPostsButton onClick={loadNewPosts}>
                        {newPosts.length} new post{newPosts.length > 1 ? 's' : ''}, load more!
                    </NewPostsButton>
                )}
                {posts.length > 0 ? (
                    posts.map((post) => {
                        if (!post.author) return null;

                        return (<div key={`${post.id}-${post.repostedBy?.name || ''}`}>
                            {post.repostedBy && (
                                <RepostBanner>
                                    <RepostIcon />
                                    <p>Re-posted by <strong>{post.repostedBy.name === name ? 'you' : post.repostedBy.name}</strong></p>
                                </RepostBanner>
                            )}
                            <MyPosts>

                                <AuthorInfo onClick={() => navigate(`/users/${post.author.id}`)}>
                                    <UserImage src={post.author.imageUrl} alt={post.author.name} />
                                    <span>{post.author.name}</span>
                                </AuthorInfo>

                                <PostImage src={post.pictureUrl} alt="Foto do post" />

                                <LikeAndDate>
                                    <LikeImage onMouseEnter={() => setHoveredPostId(post.id)} onMouseLeave={handleMouseLeave}>
                                        {post.likedByUser ? (
                                            <IoHeartFilledStyled onClick={() => handleLikeInTimeline(post.id, post.likedByUser)} />
                                        ) : (
                                            <IoHeartOutlineStyled onClick={() => handleLikeInTimeline(post.id, post.likedByUser)} />
                                        )}
                                        <p>{post.likeCount} {post.likeCount === 1 ? "pessoa curtiu" : "pessoas curtiram"}</p>
                                    </LikeImage>
                                    <CommentIcon onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}>
                                        <ChatBubbleIcon />
                                        <p>
                                            {post.comments?.length || 0}{' '}
                                            {post.comments?.length === 1 ? 'comentário' : 'comentários'}
                                        </p>
                                    </CommentIcon>
                                    <RepostIconContainer onClick={() => {
                                        setPostToRepost(post);
                                        setIsRepostModalOpen(true);
                                    }}>
                                        <RepostIcon />
                                        <p>{post.repostCount || 0} re-posts</p>
                                    </RepostIconContainer>

                                    {hoveredPostId === post.id && post.likeCount > 0 && (
                                        <Tooltip>
                                            {(() => {

                                                const otherLikers = (Array.isArray(post.likers) ? post.likers : JSON.parse(post.likers || '[]'))
                                                    .filter(liker => liker.name !== name);


                                                const namesToShow = [];
                                                if (post.likedByUser) {
                                                    namesToShow.push("Você");
                                                }
                                                namesToShow.push(...otherLikers.slice(0, 2));

                                                const totalLikes = post.likeCount;
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

                                    <DateContainer>
                                        <p>{dayjs(post.createdAt).format("DD/MM/YYYY [às] HH[h]mm")}</p>
                                    </DateContainer>
                                </LikeAndDate>

                                <Description>
                                    <p>{post.description}</p>
                                </Description>
                                {activeCommentPostId === post.id && (
                                    <CommentSection
                                        postId={post.id}
                                        comments={post.comments || []}
                                        userImage={image}
                                        postAuthorId={post.author.id}
                                        followingIds={(posts.flatMap(p => p.author ? [p.author.id] : [])) || []}
                                        token={token}
                                        onCommentPosted={handleCommentPosted}
                                    />
                                )}
                            </MyPosts>
                        </div>);
                    })
                ) : (
                    <p>Nenhuma postagem encontrada. Siga outros usuários para ver seus posts aqui!</p>
                )}
            </ContainerPosts>

            <Link to="/new-post">
                <AddPostIcon />
            </Link>
            <RepostModal
                isOpen={isRepostModalOpen}
                onClose={() => setIsRepostModalOpen(false)}
                onConfirm={handleRepost}
                isReposting={isReposting}
            />
        </Page>
    );
};
