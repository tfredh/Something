import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    NavLink,
    Route,
    Routes,
    useNavigate,
    useParams,
} from "react-router-dom";
import ErrorRoutePage from "./pages/ErrorRoutePage";
import Home from "./pages/Home";
import "./styles/App.scss";
import { RHFEmptyForm, RHFRegisterMessageHelpers } from "./utils/helpers";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { initializeClient, logout } from "./redux/clientSlice";
import Bruh from "./Bruh";

function accessTokenOrFalsyString() {
    return localStorage.getItem("accessToken") ?? "";
}

export default function App() {
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector((state) => state.client.loggedIn);
    const username = useAppSelector((state) => state.client.username);
    const dat = useAppSelector((state) => state.client);

    useEffect(() => {
        (async () => {
            const res = await axios.get("http://localhost:3001/auth/auth", {
                headers: {
                    accessToken: accessTokenOrFalsyString(),
                },
            });

            // error will be sent by the middleware if accessToken is invalid
            if (res.data.error) console.log("auth error:", res.data);
            else {
                console.log(res.data);

                const { username, id } = res.data;
                dispatch(initializeClient({ username, id }));
            }
        })();
    }, [dispatch]);

    const onLogout = () => {
        localStorage.removeItem("accessToken");
        dispatch(logout());
    };

    return (
        <div className="App" style={{ background: "gray" }}>
            <button onClick={() => console.log(dat)}>con</button>

            <nav style={{ padding: "3vw", background: "lightblue" }}>
                {!loggedIn ? (
                    <>
                        <NavLink to="/register">register</NavLink>
                        <NavLink to="/login">login</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/mkpost">mkpost</NavLink>
                        <Button variant="contained" onClick={onLogout}>
                            Logout
                        </Button>
                        <span style={{ color: "black" }}>{username}</span>
                    </>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="mkpost" element={<CreatePost />} />
                <Route path="/a" element={<Bruh />} />

                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/post/:id" element={<PostCardPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/cpass" element={<ChangePasswordPage />} />
                <Route path="*" element={<ErrorRoutePage />} />
            </Routes>
        </div>
    );
}

function ProfilePage() {
    const { userId } = useParams() as { userId: string };

    const [userUsername, setUserUsername] = useState("");
    const [userPosts, setUserPosts] = useState<any[]>([]);

    const navigator = useNavigate();
    const username = useAppSelector((state) => state.client.username);

    useEffect(() => {
        (async () => {
            try {
                const usernameRes = await axios.get(
                    `http://localhost:3001/auth/basicinfo/${userId}`
                );

                console.log(usernameRes.data);
                setUserUsername(usernameRes.data.username);
            } catch (e) {
                console.log(e);
            }

            try {
                const postsRes = await axios.get(
                    `http://localhost:3001/posts/byUser/${userId}`
                );

                console.log(postsRes.data);
                setUserPosts(postsRes.data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [userId]);

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div>hold</div>
                <h1>{userUsername}</h1>
                {username === userUsername && (
                    <Button
                        variant="contained"
                        onClick={() => navigator("/cpass")}
                    >
                        change pass
                    </Button>
                )}
            </div>

            <br />

            <div>
                {userPosts.map((post) => (
                    <div key={post.id} style={{ display: "block" }}>
                        <Button
                            onClick={() => navigator(`/post/${post.id}`)}
                            variant="contained"
                        >
                            by {post.username}: {post.title}
                        </Button>
                        <Button variant="contained" color="warning">
                            ({post.likes.length})
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChangePasswordPage() {
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                oldPass: yup.string().required("old req"),
                newPass: yup.string().required("new req"),
            })
        ),
    });

    const changePass = async (data: any) => {
        const { oldPass, newPass } = data;

        try {
            const res = await axios.put(
                "http://localhost:3001/auth/cpass",
                { oldPass, newPass },
                {
                    headers: {
                        accessToken: accessTokenOrFalsyString(),
                    },
                }
            );

            if (res.data.error) alert(res.data.error);
            else console.log(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <h1>Change Password</h1>
            <form>
                <TextField
                    label="old pass"
                    {...register("oldPass")}
                    {...RHFRegisterMessageHelpers(formState.errors["oldPass"])}
                />
                <TextField
                    label="new pass"
                    {...register("newPass")}
                    {...RHFRegisterMessageHelpers(formState.errors["newPass"])}
                />
            </form>

            <Button variant="contained" onClick={handleSubmit(changePass)}>
                change pass
            </Button>
        </div>
    );
}

function LoginPage() {
    const { register, handleSubmit, formState, reset, getValues } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                username: yup.string().required("username is required"),
                password: yup.string().required("password is required"),
            })
        ),
    });
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onSubmit = (data: any) => {
        axios
            .post("http://localhost:3001/auth/login", {
                username: data.username,
                password: data.password,
            })
            .then((res) => {
                console.log(res.data);

                if (res.data.error) alert(res.data.error);
                // no error, save the access token for future authorization uses
                else {
                    const { accessToken, username, id } = res.data;

                    localStorage.setItem("accessToken", accessToken);
                    reset(RHFEmptyForm(getValues()));
                    navigate("/");
                    dispatch(initializeClient({ username, id }));
                }
            });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "3vw",
            }}
        >
            <div>login</div>
            <TextField
                label="username"
                {...register("username")}
                {...RHFRegisterMessageHelpers(formState.errors["username"])}
            />
            <TextField
                type="password"
                label="password"
                {...register("password")}
                {...RHFRegisterMessageHelpers(formState.errors["password"])}
            />

            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                login
            </Button>
        </div>
    );
}

function RegisterPage() {
    const { register, handleSubmit, formState, reset, getValues } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                username: yup.string().required("username is required"),
                password: yup.string().required("password is required"),
            })
        ),
    });

    const onSubmit = (data: any) => {
        axios
            .post("http://localhost:3001/auth", {
                username: data.username,
                password: data.password,
            })
            .then((res) => {
                console.log(res.data);
            });

        reset(RHFEmptyForm(getValues()));
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "3vw",
            }}
        >
            <div>register</div>
            <TextField
                label="username"
                {...register("username")}
                {...RHFRegisterMessageHelpers(formState.errors["username"])}
            />
            <TextField
                type="password"
                label="password"
                {...register("password")}
                {...RHFRegisterMessageHelpers(formState.errors["password"])}
            />

            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                register
            </Button>
        </div>
    );
}

function PostCardPage() {
    const [currentComment, setCurrentComment] = useState<string>("");
    const [comments, setComments] = useState<any[]>([]);
    const [postData, setPostData] = useState<any>({});

    const username = useAppSelector((state) => state.client.username);
    const { id } = useParams() as { id: string };
    const navigator = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((res) => {
            setPostData(res.data[0]);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((res) => {
            setComments(res.data);

            console.log(res.data);
        });
    }, [id]);

    const deletePost = async (postId: string) => {
        try {
            const res = await axios.delete(
                `http://localhost:3001/posts/${postId}`,
                {
                    headers: {
                        accessToken: accessTokenOrFalsyString(),
                    },
                }
            );

            console.log(res.data);
            navigator("/");
        } catch (e) {
            console.log(e);
        }
    };

    const addComment = async () => {
        if (currentComment.length === 0) return;

        const res = await axios.post<{ error?: string; comment?: any }>(
            "http://localhost:3001/comments/",
            {
                comment: currentComment,
                postId: id,
            },
            {
                headers: {
                    // give the access token used to confirm if the user exists
                    // if user exists, then add the comment otherwise, don't
                    accessToken: accessTokenOrFalsyString(),
                },
            }
        );

        // check if authorization with the jwt key given passed
        if (res.data.error) console.log(res.data.error);
        // if it does, then add the comment
        else {
            const { comment } = res.data;

            setComments((prevComments) => [...prevComments, comment]);
            setCurrentComment("");
        }
    };

    const deleteComment = async (id: string) => {
        try {
            const res = await axios.delete(
                `http://localhost:3001/comments/${id}`,
                {
                    headers: {
                        accessToken: accessTokenOrFalsyString(),
                    },
                }
            );
            console.log(res.data);

            setComments((prevComments) => {
                return prevComments.filter((comment) => comment.id !== id);
            });
        } catch (e) {
            console.log(e);
        }
    };

    const editPost = async (option: string) => {
        switch (option) {
            case "title":
                const newTitle = prompt("new titl");
                console.log(newTitle);

                try {
                    const res = await axios.put(
                        "http://localhost:3001/posts/title",
                        {
                            newTitle,
                            postId: id,
                        },
                        {
                            headers: {
                                accessToken: accessTokenOrFalsyString(),
                            },
                        }
                    );

                    console.log(res.data);
                    setPostData((prevPostData: any) => {
                        return { ...prevPostData, title: newTitle };
                    });
                } catch (e) {
                    console.log(e);
                }

                break;
            default:
            //
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <div>
                <button onClick={() => console.log(postData)}>asd</button>
                <div>{id}</div>
                <div>{postData.title}</div>
                <div>by: {postData.username}</div>
                {username === postData.username && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => deletePost(id)}
                    >
                        Delete post
                    </Button>
                )}
            </div>

            <div className="nice" style={{ marginLeft: "10vw" }}>
                <TextField
                    label="Comment"
                    value={currentComment}
                    onChange={({ target: { value } }) =>
                        setCurrentComment(value)
                    }
                />
                <Button variant="contained" onClick={addComment}>
                    Add comment
                </Button>

                <div>
                    {comments.map((comment) => (
                        <div key={comment.id}>
                            <span>
                                {comment.username}: {comment.comment}
                            </span>
                            {comment.username === username && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteComment(comment.id)}
                                >
                                    x
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {username === postData.username && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => editPost("title")}
                >
                    edit title
                </Button>
            )}
        </div>
    );
}

function CreatePost() {
    const navigator = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) navigator("/login");
    }, [navigator]);

    const { register, handleSubmit, formState, reset, getValues } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                title: yup.string().required("Title is required"),
            })
        ),
    });
    interface NewPostInput {
        title: string;
    }

    const onPostSubmit = async (data: object) => {
        const { title } = data as NewPostInput;

        try {
            const req = await axios.post(
                "http://localhost:3001/posts",
                {
                    title,
                },
                {
                    headers: {
                        accessToken: accessTokenOrFalsyString(),
                    },
                }
            );
            console.log(req.data);
            reset(RHFEmptyForm(getValues()));
            navigator("/");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <form>
                <TextField
                    label="text"
                    className="nice"
                    {...register("title")}
                    {...RHFRegisterMessageHelpers(formState.errors["title"])}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit(onPostSubmit)}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
}
