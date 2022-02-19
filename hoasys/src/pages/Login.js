import { useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons/Main";

function Login() {
  const navigate = useNavigate();
  return (
    <main className="w-screen h-full">
      <span>
        <div
          className=" bg-gray-50 container pt-4 pb-10 px-6
           w-80
            h-500
            justify-center
            mx-auto 
            mt-5
            flex 
            flex-col
            text-gray-800
            lg:w-1/3
            "
        >
          <div
            className="text p-2
               inline-block text-xl text-center border-b border-gray-300 mb-6"
          >
            <b>To continue login to</b>
          </div>
          <form action="#" className="px-2 lg:px-4">
            <div className="data">
              <b>Email or Phone</b>
              <input
                type="text"
                className="border border-gray-800 w-full p-2 mt-2 mb-4 rounded-sm"
                required
                placeholder="Enter email or phone number"
              />
            </div>
            <div className="data">
              <b>Password</b>
              <input
                type="password"
                className="border border-gray-800 w-full p-2 mt-2 mb-4 rounded-sm"
                required
                placeholder="Enter password"
              />
            </div>
            <span className="mb-2 inline-flex justify-between w-full">
              <label>
                Remember me <input type="checkbox" />
              </label>
              <span className="forgot-pass underline">
                <a href="#">Forgot Password?</a>
              </span>
            </span>

            <div className="bg-meadow-900 btn mb-2">
              <Button
                onClick={() => navigate("/dashboard", { replace: true })}
                classes={"block w-full h-11 bg-meadow-700 text-white"}
              >
                LOGIN
              </Button>
            </div>
            <div className="signup-link mb-2">Not a member?</div>
            <Button
              classes={
                "block w-full h-11 border border-meadow-700 text-meadow-700"
              }
              onClick={() => navigate("/signup", { replace: true })}
            >
              SIGN UP
            </Button>
          </form>
        </div>
      </span>
    </main>
  );
}

export default Login;
