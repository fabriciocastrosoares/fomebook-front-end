import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import dayjs from "dayjs";
import { OptionLink, Options } from "../registrationAndLogin/styled";
import { ChatBubbleIcon, CommentIcon, DateContainer, Description, ExitIcon, LikeAndDate, MyPage, MyPosts, NameBio, Page, Tooltip, PostImage, RepostIconContainer, RepostIcon } from "../HomePage/styled";
import { FollowButton, LikeImage, IoHeartFilledStyled, IoHeartOutlineStyled, UserImage } from "../AnotherUsersProfile/styled";
import handleLogout from "../../utils/logic";
import handleLike from "../../utils/likesAndUnlikes";
import handleFollow from "../../utils/followings";
import CommentSection from "../../components/commentSection";
import { FacebookIcon, MyLogo, Topo } from "../timeline/styled";
import RepostModal from "../../components/RepostModal";
import apiPosts from "../../services/apiPosts";

export default function AnotherUsersProfile() {
  const { id } = useParams();
  const { name, setName, token, setToken, image } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

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

    async function fetchData() {
      try {
        if (!token) return;

        const [loggedInUserRes, userProfileRes] = await Promise.all([
          apiUsers.getUser(token),
          apiUsers.getUserById(token, id),
        ]);

        const loggedInUserData = loggedInUserRes.data;
        const userProfileData = userProfileRes.data;

        setLoggedInUser(loggedInUserData);
        setUserProfile(userProfileData);
        setPosts(userProfileData.posts || []);

        const isUserFollowing =
          Array.isArray(userProfileData.followers) &&
          userProfileData.followers.some(
            (follower) =>
              follower &&
              (follower.followerId === loggedInUserData.id ||
                follower.id === loggedInUserData.id)
          );
        setIsFollowing(isUserFollowing);
      } catch (err) {
        alert("Não foi possível carregar os dados. Tente novamente.");
        console.error(err.response?.data || err.message);
        navigate("/home-page");
      }
    }

    fetchData();
  }, [id, token, name, navigate]);

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


  if (!userProfile || !loggedInUser) {
    return (
      <Page>
        <p>Carregando perfil...</p>
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
          <OptionLink onClick={() => navigate("/Time-line")}>Inicio</OptionLink>
          <ExitIcon onClick={() => handleLogout(token, setName, setToken, navigate)} />
        </Options>
      </Topo>

      <MyPage>
        <UserImage src={userProfile.imageUrl} alt={userProfile.name} />
        <NameBio>
          <h3>{userProfile.name}</h3>
          <h4>{userProfile.biography}</h4>
          <FollowButton
            onClick={() =>
              handleFollow(followLoading, setFollowLoading, isFollowing, token, id, setIsFollowing)
            }
            disabled={followLoading}
            $isFollowing={isFollowing}
          >
            {followLoading
              ? "Carregando..."
              : isFollowing
                ? "Deixar de Seguir"
                : "Seguir"}
          </FollowButton>
        </NameBio>
      </MyPage>

      {posts.length > 0 ? (
        posts.map((post) => (
          <MyPosts key={post.id}>
            <PostImage src={post.pictureUrl} alt="Foto do post" />

            <LikeAndDate>
              <LikeImage onMouseEnter={() => setHoveredPostId(post.id)} onMouseLeave={handleMouseLeave}>
                {post.likedByUser ? (
                  <IoHeartFilledStyled onClick={() => handleLike(post.id, post.likedByUser, token, setPosts)} />
                ) : (
                  <IoHeartOutlineStyled onClick={() => handleLike(post.id, post.likedByUser, token, setPosts)} />
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
                      .filter(name => name !== loggedInUser.name);


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
                userImage={loggedInUser.imageUrl}
                postAuthorId={userProfile.id} 
                followingIds={(loggedInUser.following || []).map(f => f.id)}
                token={token}
                onCommentPosted={handleCommentPosted}
              />
            )}
          </MyPosts>
        ))
      ) : (
        <p>Este usuário ainda não tem nenhuma postagem.</p>
      )}
      <RepostModal
          isOpen={isRepostModalOpen}
          onClose={() => setIsRepostModalOpen(false)}
          onConfirm={handleRepost}
          isReposting={isReposting}
      />
    </Page>
  );
};
