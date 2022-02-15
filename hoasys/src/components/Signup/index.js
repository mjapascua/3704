function Login() {
    return (
        <>
            <main>
                <body>
                    <span>
                        <div className="container">
                            <label for="show" className="close-btn fas fa-times" title="close"></label>
                            <div className="text">
                                Signup Form
                            </div>
                            <form action="#">
                                <div className="data">
                                    <label>Email</label>
                                    <input type="text" required />
                                </div>
                                <div className="data">
                                    <label>Phone</label>
                                    <input type="text" required />
                                </div>
                                <div className="data">
                                    <label>Password</label>
                                    <input type="password" required />
                                </div>
                                <div className="forgot-pass">
                                    <a href="#">Forgot Password?</a>
                                </div>
                                <div className="btn">
                                    <div className="inner"></div>
                                    <button type="submit">LOGIN</button>
                                </div>
                                <div className="signup-link">
                                    Not a member? <a href="#">Signup now.</a>
                                </div>
                            </form>
                        </div>
                    </span>
                </body>
            </main>
        </>
    );
}

export default Login;