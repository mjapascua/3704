function Login() {
    return (
        <>
            <main>
                <body>
                    <span>
                        <div class="container">
                            <label for="show" class="close-btn fas fa-times" title="close"></label>
                            <div class="text">
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
                            </form>
                        </div>
                    </span>
                </body>
            </main>
        </>
    );
}