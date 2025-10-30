import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import dayjs from "dayjs";
import { OptionLink, Options } from "../registrationAndLogin/styled";
import { AddPostIcon, CommentIcon, DateContainer, Description, ExitIcon, LikeAndDate, Page, PostImage, Tooltip } from "../HomePage/styled";
import { LikeImage, IoHeartFilledStyled, IoHeartOutlineStyled, UserImage } from "../AnotherUsersProfile/styled";
import handleLogout from "../../utils/logic";
import apiPosts from "../../services/apiPosts";
import styled from "styled-components";
import { FaFacebookF } from "react-icons/fa6";
import CommentSection from "../../services";

export default function TimeLine() {
    const { name, setName, token, setToken, image } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [likeLoading, setLikeLoading] = useState(false);
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);

    async function fetchData() {
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
    }

    useEffect(() => {
        if (!token || !name) {
            navigate("/");
            return;
        }
        fetchData().finally(() => setLoading(false));
    }, [token, name, navigate]);

    async function handleLikeInTimeline(postId, likedByUser) {
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            const action = likedByUser ? apiPosts.dislikePost : apiPosts.likePost;
            await action(token, postId);
            await fetchData(); // Recarrega os posts para garantir consistência
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
                    // O usuário logado está no contexto, então podemos usá-lo
                    const commentWithUser = {
                        ...newComment,
                        user: {
                            // Assumindo que o contexto tem id, name e image
                            id: null, // O id do usuário não está diretamente no contexto, mas não é crítico para a UI imediata
                            name: name,
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

    if (loading) {
        return (
            <Page>
                <p>Carregando timeline...</p>
            </Page>
        );
    }

    return (
        <Page>
            <Top>
                <UserImage src={image} alt={name} onClick={() => navigate("/home-page")} />
                <MyLogo >
                    <FacebookIcon />
                    <h1>omebook</h1>
                </MyLogo>
                <Options>
                    <OptionLink onClick={() => navigate("/home-page")}>Meu Perfil</OptionLink>
                    <ExitIcon onClick={() => handleLogout(token, setName, setToken, navigate)} />
                </Options>
            </Top>
            <ContainerPosts>
                {posts.length > 0 ? (
                    posts.map((post) => {
                        if (!post.author) return null; // Adiciona esta verificação

                        return (<MyPosts key={post.id}>
                            <AuthorInfo onClick={() => navigate(`/users/${post.author.id}`)}>
                                <UserImage src={post.author.imageUrl} alt={post.author.name} />
                                <span>{post.author.name}</span>
                            </AuthorInfo>

                            <PostImage src={post.pictureUrl} alt="Foto do post" />

                            <LikeAndDate>
                                <div>
                                    <LikeImage onMouseEnter={() => setHoveredPostId(post.id)} onMouseLeave={handleMouseLeave}>
                                        {post.likedByUser ? (
                                            <IoHeartFilledStyled onClick={() => handleLikeInTimeline(post.id, post.likedByUser)} />
                                        ) : (
                                            <IoHeartOutlineStyled onClick={() => handleLikeInTimeline(post.id, post.likedByUser)} />
                                        )}
                                        <p>{post.likeCount} {post.likeCount === 1 ? "pessoa curtiu" : "pessoas curtiram"}</p>
                                    </LikeImage>
                                    <CommentIcon onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}>
                                        <p>{post.comments?.length || 0}</p>
                                    </CommentIcon>
                                </div>

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
                                    token={token}
                                    onCommentPosted={handleCommentPosted}
                                />
                            )}
                        </MyPosts>);
                    })
                ) : (
                    <p>Nenhuma postagem encontrada. Siga outros usuários para ver seus posts aqui!</p>
                )}
            </ContainerPosts>

            <Link to="/new-post">
                <AddPostIcon />
            </Link>
        </Page>
    );
};

export const MyLogo = styled.div`
    display: flex;   
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 60px;
    color: #0864f7;
    cursor: pointer; 
    margin-right: 1350px;
`;

const FacebookIcon = styled(FaFacebookF)`
    margin-right: -10px;
    font-size: 60px;
    
`;


export const Top = styled.div`
    background-color: #dbe6f8ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 90px;
    width: 100%;
    border-bottom: 1px solid #aec8f1ff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 0 20px; 
    box-sizing: border-box; 

    @media (max-width: 600px) {
        flex-direction: column;
        padding: 10px 20px;
        gap: 10px;
    }img {
        width: 50px;
        height: 50px;
        border: 2px solid #aec8f1ff;
    }

`;

export const ContainerPosts = styled.div`
    margin-top: 130px;
`;

const AuthorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    cursor: pointer;

    img {
        width: 50px;
        height: 50px;
        border: 2px solid #aec8f1ff;
    }
    span { font-weight: bold; font-size: 18px; }
`;

export const MyPosts = styled.div`
    border: 1px solid #aec8f1ff;
    width: 95%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
    border-radius: 5px;
    margin-top: 20px;
    p {
        word-break: break-word; 
    }
`;
