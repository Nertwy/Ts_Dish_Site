import React,{useState} from "react";
import { User } from "../../../interfaces/user";
const Login :React.FC = ()=>{
  const [title, setTitle] = useState<User>({
    name: "",
    password: "",
  });

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    let a = event.currentTarget.value;
    let item = event.currentTarget.name;
    // console.log(event.currentTarget.value);
    setTitle((prevState) => ({
      ...prevState,
      [item]: a,
    }));
  }
  function PostRegister() {
    fetch("http://localhost:8000/", {
      method: "POST",
      body: JSON.stringify(title),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
  return(
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-center">
            Login To Your Account
          </h3>
          <form action="">
            <div>
              <label htmlFor="email" className="block">
                Email
              </label>
              <input
                name="name"
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required={true}
                value={title.name}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="" className="block">
                Password
              </label>
              <input
              name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required={true}
                value={title.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex item-baseline justify-between">
              <button
                type="button"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >Login</button>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
  )
}


export default Login;