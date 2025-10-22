import apiPosts from "../services/apiPosts";


    
export default function deletePost(postId, token, setPosts, setIsModalOpen, setPostToDelete) {
    apiPosts.deletePost(token, postId)
        .then(res => {
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
            setIsModalOpen(false);
            setPostToDelete(null);
        })
        .catch(err => {
            console.error("Erro ao deletar post:", err.response?.data || err.message);
            alert("Não foi possível deletar o post. Tente novamente.");
        })

};