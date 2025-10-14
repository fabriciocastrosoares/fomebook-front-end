import apiPosts from "../services/apiPosts";

  
  export default async function handleLike(postId, alreadyLiked, token, setPosts) {
    try {
      if (alreadyLiked) {
        await apiPosts.dislikePost(token, postId);
      } else {
        await apiPosts.likePost(token, postId);
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              likedByUser: !alreadyLiked,
              likeCount: alreadyLiked
                ? post.likeCount - 1
                : post.likeCount + 1,
            }
            : post
        )
      );
    } catch (err) {
      alert(err.response?.data || "Erro ao curtir/descurtir o post.");
      console.error(err);
    }
  };