import "./login.css";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../../context";

function Login() {
  const { dispatch } = useGlobalContext();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = searchParams.get("mode") === "login";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !username)) {
      toast.error("All fields are required!");
      return;
    }

    const url = isLogin
      ? "http://localhost:5000/auth/verify"
      : "http://localhost:5000/auth/register";

    const payload = isLogin
      ? { email, password }
      : { username, email, password };

    const options = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      if (!navigator.onLine) {
        toast.error("You are offline. Please check your internet connection.");
        return;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data);
      

      if (res.ok) {
        toast.success(isLogin ? "Login successful!" : "Registered successfully!");

        localStorage.setItem("user", data.user);
        dispatch({ type: "LOGIN_SUCCESS", payload: data.user });

        if (isLogin) {
          navigate("/");
        } else {
          setTimeout(() => navigate("/auth?mode=login"), 1350);
        }
      } else {
        toast.error(data.message || "Unexpected error occurred.");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      toast.error("Unable to connect. Please try again later.");
    }
  };

  return (
    <section className="login">
      <ToastContainer
        className="toast-position"
        position="top-center"
        autoClose={1300}
      />
      <div className="form-container">
        <h1>{isLogin ? "Login" : "Register"}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-field">
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                name="username"
                required
              />
              <span></span>
              <label>Username</label>
            </div>
          )}
          <div className="input-field">
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
            />
            <span></span>
            <label>Email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
            />
            <span></span>
            <label>Password</label>
          </div>
          <button className="submit-btn" type="submit">
            Submit
          </button>
          <div className="signup-link">
            {isLogin ? "Not a member?" : "Already have an account?"}
            <Link to={`/auth?mode=${isLogin ? "signup" : "login"}`}>
              {isLogin ? " Sign Up" : " Login"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
