import MyLogo from "../../components/Logo";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import apiUsers from "../../services/apiUsers";
import dayjs from "dayjs";
import { OptionLink, Options, Page, Top } from "../registrationAndLogin/styled";
import { DateContainer, Description, ExitIcon, LikeAndDate, MyPage, MyPosts, NameBio, PostImage, UserImage } from "../HomePage/styled";
import { FollowButton, LikeImage, IoHeartFilledStyled, IoHeartOutlineStyled } from "../AnotherUsersProfile/styled";
import handleLogout from "../../utils/logic";
import handleLike from "../../utils/likesAndUnlikes";
import handleFollow from "../../utils/followings";



export default function AnotherUsersProfile() {
  const { id } = useParams();
  const { name, setName, token, setToken } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

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
        setPosts(userProfileData.posts);

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

  if (!userProfile || !loggedInUser) {
    return (
      <Page>
        <p>Carregando perfil...</p>
      </Page>
    );
  };

  return (
    <Page>
      <Top>
        <MyLogo onClick={() => navigate("/home-page")} />
        <Options>
          <OptionLink onClick={() => navigate("/home-page")}>Início</OptionLink>
          <ExitIcon onClick={() => handleLogout(token, setName, setToken, navigate)} />
        </Options>
      </Top>

      <MyPage>
        <UserImage src={userProfile.imageUrl} alt={userProfile.name} />
        <NameBio>
          <h3>{userProfile.name}</h3>
          <h4>{userProfile.biography}</h4>
          <FollowButton
            onClick={() => handleFollow(followLoading, setFollowLoading, isFollowing, token, id, setIsFollowing)}
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
              <LikeImage onClick={() => handleLike(post.id, post.likedByUser, token, setPosts)}>
                {post.likedByUser ? (
                  <IoHeartFilledStyled />
                ) : (
                  <IoHeartOutlineStyled />
                )}
                <p>
                  {post.likeCount}{" "}
                  {post.likeCount === 1 ? "curtida" : "curtidas"}
                </p>
              </LikeImage>

              <DateContainer>
                <p>{dayjs(post.createdAt).format("DD/MM/YYYY [às] HH[h]mm")}</p>
              </DateContainer>
            </LikeAndDate>

            <Description>
              <p>{post.description}</p>
            </Description>
          </MyPosts>
        ))
      ) : (
        <p>Este usuário ainda não tem nenhuma postagem.</p>
      )}
    </Page>
  );
};