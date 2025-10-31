import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiComments from "../services/apiComments";
import { CommentsContainer, CommentList, CommentItem, CommentContent, NewCommentForm, SendCommentIcon, CommentAuthor, AuthorStatus } from "./styled";

export default function CommentSection({ postId, comments, userImage, token, onCommentPosted, postAuthorId, followingIds }) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleCommentSubmit(e) {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const { data: createdComment } = await apiComments.createComment(token, postId, { text: newComment });
            onCommentPosted(postId, createdComment);
            setNewComment("");
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Não foi possível postar seu comentário. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <CommentsContainer>
            <CommentList>
                {comments.map(comment => (
                    <CommentItem  onClick={() => navigate(`/users/${comment.user.id}`)} key={comment.id}>
                        <img src={comment.user.imageUrl} alt={comment.user.name} />
                        <CommentContent>
                            <CommentAuthor >
                                <strong>{comment.user.name}</strong>
                                {comment.user.id === postAuthorId && (
                                    <AuthorStatus>• post's author</AuthorStatus>
                                )}
                                {followingIds.includes(comment.user.id) && comment.user.id !== postAuthorId && (
                                     <AuthorStatus>• following</AuthorStatus>
                                )}
                            </CommentAuthor>
                            <p>{comment.text}</p>
                        </CommentContent>
                    </CommentItem>
                ))}
            </CommentList>

            <NewCommentForm onSubmit={handleCommentSubmit}>
                <img src={userImage} alt="Seu perfil" />
                <input
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                    required
                />
                <button type="submit" style={{ background: 'none', border: 'none' }} disabled={isSubmitting}>
                    <SendCommentIcon />
                </button>
            </NewCommentForm>
        </CommentsContainer>
    );
}