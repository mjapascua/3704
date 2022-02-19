import { useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
function Login() {
  const navigate = useNavigate();
  return (
    <main>
      <span>
        <div
          className="bg-gray-50 container pt-4 pb-10 px-6
           w-80
            h-500
            justify-center
            mx-auto 
            mt-5
            mb-12
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
            <b>To continue signup with</b>
          </div>
          <form method="post" action="http://localhost:5000/api/register" className="px-2 lg:px-4">
            <div className="data">
              <label>Email</label>
              <input
                name="email"
                type="text"
                className="border border-gray-800 w-full p-2 mt-2 mb-4 rounded-sm"
                required
              />
            </div>
            <div className="data">
              <label>Phone</label>
              <input
                name="cellphone"
                type="text"
                className="border border-gray-800 w-full p-2 mt-2 mb-4 rounded-sm"
                required
              />
            </div>
            <div className="data">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="border border-gray-800 w-full p-2 mt-2 mb-4 rounded-sm"
                required
              />
            </div>
            <div className="btn mb-4">
              <Button classes={"block w-full h-11 bg-meadow-700 text-white"}>
                SIGN UP
              </Button>
            </div>
            <div className="signup-link mb-2">Already a member?</div>
            <Button
              classes={
                "block w-full h-11 border border-meadow-700 text-meadow-700"
              }
              onClick={() => navigate("/login", { replace: true })}
            >
              LOG IN
            </Button>
          </form>
        </div>
      </span>
    </main>
  );
}

export default Login;
