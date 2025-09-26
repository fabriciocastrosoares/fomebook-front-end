import styled from "styled-components";
import MyLogo from "../../components/Logo";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { IoExitOutline } from 'react-icons/io5';
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import apiAuth from "../../services/apiAuth";
import apiPosts from "../../services/apiPosts";
import formatPostDate from "utils/formatPostdate";


export default function AnotherUsersProfile() {
    const { id } = useParams();
    const { name, setName, token, setToken } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [likeDisabled, setLikeDisabled] = useState(false);

    // Função auxiliar para verificar se o post foi curtido pelo usuário logado
    const isLikedByMe = (post, user) => {
        if (!post || !Array.isArray(post.likedBy) || !user) {
            return false;
        }
        return post.likedBy.some(like => like.userId === user.id);
    };

    function handleLogout() {
        apiAuth.logout(token)
            .then(() => {
                setName(undefined);
                setToken(undefined);
                localStorage.clear();
                navigate("/");
            })
            .catch(err => {
                alert(err.response?.data || "Houve um erro ao fazer logout.");
            });
    };

    const fetchData = async () => {
      try {
          if (!token) return;
          // Executa as duas chamadas em paralelo para otimizar o carregamento
          const [loggedInUserRes, userProfileRes] = await Promise.all([
              apiUsers.getUser(token),
              apiUsers.getUserById(token, id)
          ]);

          const loggedInUserData = loggedInUserRes.data;
          const userProfileData = userProfileRes.data;

          setLoggedInUser(loggedInUserData);
          setUserProfile(userProfileData);

          // Lógica robusta para verificar se o usuário logado segue o perfil visitado
          const isUserFollowing = Array.isArray(userProfileData.followers) && 
                                  userProfileData.followers.some(
                                      follower => follower && (follower.followerId === loggedInUserData.id || follower.id === loggedInUserData.id)
          );
          setIsFollowing(isUserFollowing);
      } catch (err) {
          alert("Não foi possível carregar os dados. Tente novamente.");
          console.error(err.response?.data || err.message);
          navigate("/home-page");
      }
    };

    useEffect(() => {
        if (!token || !name) {
            navigate("/");
            return;
        }
        fetchData();
    }, [id, token, name, navigate]); // Removido loggedInUser.id para evitar loop

    async function handleLike(postId, isLiked) {
        if (likeDisabled) return;
        setLikeDisabled(true);
    
        try {
            if (isLiked) {
                await apiPosts.dislikePost(token, postId);
            } else {
                await apiPosts.likePost(token, postId);
            }
            await fetchData(); // Re-sincroniza com o servidor para garantir consistência
        } catch (err) {
            alert("Não foi possível curtir/descurtir o post. Tente novamente.");
            console.error(err.response?.data || err.message);
            // Em caso de erro, busca os dados novamente para reverter a UI para o estado real
            await fetchData();
        } finally {
            setLikeDisabled(false);
        }
    }

    async function handleFollow() {
      if (followLoading) return;
      setFollowLoading(true);
  
      try {
          if (isFollowing) {
              await apiUsers.unfollowUser(token, id);
          } else {
              await apiUsers.followUser(token, id); 
          }
          await fetchData(); // Re-sincroniza com o servidor para garantir consistência
      } catch (error) {
          alert("Ocorreu um erro ao tentar seguir/deixar de seguir o usuário.");
          console.error(error.response?.data || error.message);
          await fetchData(); // Re-sincroniza em caso de erro
      } finally {
          setFollowLoading(false);
      }
    }

    if (!userProfile || !loggedInUser) {
        return <Page><p>Carregando perfil...</p></Page>;
    }

    return (
        <Page>
            <Top>
                <MyLogo />
                <Options>
                    <OptionLink onClick={() => navigate("/home-page")}>Início</OptionLink>
                    <ExitIcon onClick={handleLogout} />
                </Options>
            </Top>
            <MyPage>
                <UserImage src={userProfile.imageUrl} alt={userProfile.name} />
                <NameBio>
                    <h3>{userProfile.name}</h3>
                    <h4>{userProfile.biography}</h4>
                    <FollowButton onClick={handleFollow} disabled={followLoading} $isFollowing={isFollowing}>
                        {followLoading ? 'Carregando...' : (isFollowing ? 'Deixar de Seguir' : 'Seguir')}
                    </FollowButton>
                </NameBio>
            </MyPage>

            {userProfile.posts.length > 0 ? (
                userProfile.posts.map(post => {
                    const isLiked = isLikedByMe(post, loggedInUser);
                    const likedByArray = post.likedBy || [];
                    const likeCount = likedByArray.length;

                    return (
                        <MyPosts key={post.id}>
                            <PostImage src={post.pictureUrl} alt="Foto do post" />
                            <LikeAndDate>
                                <LikeImage onClick={() => !likeDisabled && handleLike(post.id, isLiked)} disabled={likeDisabled} $isLiked={isLiked}>
                                    {isLiked ? <IoHeartFilledStyled /> : <IoHeartOutlineStyled />}
                                    <p>{likeCount} {likeCount === 1 ? "curtida" : "curtidas"}</p>
                            </LikeImage>
                            <DateContainer>
                                <p>{formatPostDate(post.createdAt)}</p>
                            </DateContainer>
                        </LikeAndDate>
                        <Descrption>
                            <p>{post.description}</p>
                        </Descrption>
                    </MyPosts>
                    );
                })
            ) : (
                <p>Este usuário ainda não tem nenhuma postagem.</p>
            )}

        </Page>
    );
};


const Page = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    flex-direction: column;

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
const OptionLink = styled.h5`
    cursor: pointer;
    color: ${props => props.$primary === false ? '#777' : ''};
`;

const ExitIcon = styled(IoExitOutline)`
  color: #0864f7;
  font-weight: 700;
  width: 30px;
  height: 30px;
  cursor: pointer; 
`;

const MyPage = styled.div`
    border: 1px solid #aec8f1ff;
    width: 100vh;
    height: 10vw;
    margin-top: 200px;
    display: flex;
    align-items: center;
    justify-content: space-around;
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

const FollowButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${props => (props.$isFollowing ? '#ff4b4b' : '#aec8f1ff')};
    background-color: ${props => (props.$isFollowing ? '#ff4b4b' : '#0864f7')};
    color: white;
    border-radius: 5px;
    width: 200px;
    height: 30px;
    cursor: ${props => (props.disabled ? 'wait' : 'pointer')};
    font-size: 16px;
    font-weight: bold;
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
    margin-left: 20px;
    cursor: ${props => props.disabled ? 'wait' : 'pointer'};
`;

const IoHeartOutlineStyled = styled(IoHeartOutline)`
    width: 30px;
    height: 30px;
    color: #0864f7;
`;

const IoHeartFilledStyled = styled(IoHeart)`
    width: 30px;
    height: 30px;
    color: #ff4b4b;
`;

const DateContainer = styled.div`
    margin-right: 20px;
`;

const Descrption = styled.div`
    margin-left: 25px;
    margin-top: 20px;
`;