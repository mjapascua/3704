function Login() {
    return (
        <>
            <main>
                <body>
                    <span>
                        <div
                            class="container"
                            className="p-2
                            bg-salmon-600
                              w-60
                              h-500
                              mb-24
                              justify-center
                              mx-auto 
                              flex 
                              flex-col
                              text-white"
                        >
                            <label for="show" class="close-btn fas fa-times" title="close"></label>
                            <div
                                class="text"
                                className="p-2
                                 inline-block"
                            >
                                Signup Form
                            </div>
                            <form action="#">
                                <div class="data">
                                    <label>Email</label>
                                    <input type="text" required />
                                </div>
                                <div class="data">
                                    <label>Phone</label>
                                    <input type="text" required />
                                </div>
                                <div class="data">
                                    <label>Password</label>
                                    <input type="password" required />
                                </div>
                                <div class="forgot-pass">
                                    <a href="#">Forgot Password?</a>
                                </div>
                                <div
                                    class="btn"
                                    className="bg-salmon-800"
                                >
                                    <div class="inner"></div>
                                    <button type="submit">SIGNUP</button>
                                </div>
                                <div class="signup-link">
                                    Already a member? <a className="underline" href="#">Log-in.</a>
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