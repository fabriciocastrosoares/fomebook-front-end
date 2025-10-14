import apiFollowers from "../services/apiFollowers";
 
 export default async function handleFollow(followLoading, setFollowLoading, isFollowing, token, id, setIsFollowing) {
    if (followLoading) return;
    setFollowLoading(true);

    try {
      if (isFollowing) {
        await apiFollowers.unfollowUser(token, id);
      } else {
        await apiFollowers.followUser(token, id);
      }

      setIsFollowing((prev) => !prev);
    } catch (error) {
      alert("Ocorreu um erro ao tentar seguir/deixar de seguir o usuário.");
      console.error(error.response?.data || error.message);
    } finally {
      setFollowLoading(false);
    }
  };