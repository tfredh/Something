import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Like } from "../types/general";

function accessTokenOrFalsyString() {
    return localStorage.getItem("accessToken") ?? "";
}

export default function Home(): JSX.Element {
    const [posts, setPosts] = useState<any[]>([]);
    const [userLikedPostIds, setUserLikedPostIds] = useState<number[]>([]);

    const navigator = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) navigator("/login");
        else {
            (async () => {
                try {
                    const res = await axios.get("http://localhost:3001/posts", {
                        headers: {
                            accessToken: accessTokenOrFalsyString(),
                        },
                    });
                    console.log(res.data);
                    setPosts(res.data.posts);
                    setUserLikedPostIds(
                        res.data.userLikedPosts.map(
                            (like: Like) => like.post_id
                        )
                    );
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }, [navigator]);

    const likePost = async (postId: number) => {
        try {
            const res = await axios.post(
                "http://localhost:3001/likes",
                { postId },
                {
                    headers: {
                        accessToken: accessTokenOrFalsyString(),
                    },
                }
            );

            console.log(res.data);
            setPosts((previousPosts) =>
                previousPosts.map((prevPost) => {
                    if (prevPost.id !== postId) return prevPost;

                    if (res.data.liked) {
                        return { ...prevPost, likes: [...prevPost.likes, 0] };
                    } else {
                        return {
                            ...prevPost,
                            likes: prevPost.likes.slice(1),
                        };
                    }
                })
            );

            setUserLikedPostIds((prevUserLikedPostIds) => {
                if (prevUserLikedPostIds.includes(postId)) {
                    return prevUserLikedPostIds.filter(
                        (prevPostId) => prevPostId !== postId
                    );
                } else {
                    return [...prevUserLikedPostIds, postId];
                }
            });
        } catch (e) {}
    };

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id} style={{ display: "block" }}>
                    <Button
                        onClick={() => navigator(`/profile/${post.user_id}`)}
                        variant="contained"
                        color="success"
                    >
                        by: {post.username}
                    </Button>

                    <Button
                        onClick={() => navigator(`/post/${post.id}`)}
                        variant="contained"
                    >
                        {post.title}
                    </Button>

                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => likePost(post.id)}
                    >
                        {userLikedPostIds.includes(post.id) ? "Unlike" : "Like"}{" "}
                        ({post.likes.length})
                    </Button>
                </div>
            ))}
        </div>
    );
}
