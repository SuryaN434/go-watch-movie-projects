import { Fragment, useState } from "react";
import LoginForm from "./form/LoginForm";
import { useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setJwtToken } = useOutletContext();
    const { setAlertClassName } = useOutletContext();
    const { setAlertMessage } = useOutletContext();
    const { toggleRefresh } = useOutletContext();

    const navigate = useNavigate();

    const handleSubmission = (event) => {
        event.preventDefault();
        console.log("email/pass", email, password);

        //request payload
        let payload = {
            email: email,
            password: password
        }

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        }

        fetch(`/authenticate`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setAlertClassName("alert-danger");
                    setAlertMessage(data.message);
                } else {
                    setJwtToken(data.access_token);
                    setAlertClassName("d-none");
                    setAlertMessage("");
                    toggleRefresh(true);
                    navigate("/");
                }
            })
            .catch(error => {
                setAlertClassName("alert-danger");
                setAlertMessage(error);
            });
    }


    return(
        <Fragment>
            <div className="p-4 text-center">
                <h4>Login</h4>
            </div>
            <div className="p-4 col-md-6 offset-md-3">
                <form onSubmit={handleSubmission}>
                    <LoginForm
                        title="Email address"
                        type="email"
                        className="form-control"
                        name="email"
                        autoComplete="email-new"
                        placeholder="Enter your email..."
                        onChange={(event) => setEmail(event.target.value)}
                    ></LoginForm>

                    <LoginForm
                        title="Password"
                        type="password"
                        className="form-control"
                        name="password"
                        autoComplete="password-new"
                        placeholder="Enter your password..."
                        onChange={(event) => setPassword(event.target.value)}
                    ></LoginForm>

                    <input type="submit" value="Login" className="button-login-full-width"></input>
                </form>
            </div>
        </Fragment>
    )
}

export default Login;