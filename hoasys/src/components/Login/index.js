function Login() {
    return (
        <>
            <main>
                <body>
                    <span>
                        <div
                            class="container"
                            className="p-2
                             bg-meadow-700
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
                                Login Form
                            </div>
                            <form action="#">
                                <div class="data">
                                    <label>Email or Phone</label>
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
                                    className="bg-meadow-900"
                                >
                                    <div class="inner"></div>
                                    <button type="submit">LOGIN</button>
                                </div>
                                <div class="signup-link">
                                    Not a member? <a class="underline" href="#">Signup now.</a>
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