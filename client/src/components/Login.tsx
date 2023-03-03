import React, { FC, useState } from "react";
import { Router, useNavigate } from "react-router-dom";
import { User } from "../../../interfaces/user";
import { getAccessToken } from "../AccessToken";
import { useInput } from "../hooks/Hooks";
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Moderator = "MODERATOR"
}
const Register: React.FC<{ showLogin: Function }> = (prop) => {
  const confirm = useInput("");
  const [errorResulter, setErrorResulter] = useState(false);
  const [title, setTitle] = useState<User>({
    name: "",
    password: "",
    email: "",
    // confirm: "",
    admin: false,
    role: Role.User
  });

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    const RegisterMiddleware = () => {};
    let a = event.currentTarget.value;
    let item = event.currentTarget.name;
    // console.log(event.currentTarget.value);
    setTitle((prevState) => ({
      ...prevState,
      [item]: a
    }));
  }

  async function PostRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let result = await fetch("http://localhost:8000/register", {
      method: "POST",
      body: JSON.stringify(title),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    //handle Error if bad request to server!
    if (result.status != 201) {
      // console.log("SOMETHING WRONG");
      setErrorResulter(true);
    }
  }
  return (
    <div
      className=' flex items-center justify-center min-h-screen bg-gray-100 '
      // style={{ display: prop.showen ? "block" : "none" }}
      aria-modal='true'>
      <div className='px-16 py-8 mt-6 text-left bg-white shadow-lg'>
        <h3 className='text-2xl font-bold text-center mb-3'>
          Register new account
        </h3>
        <form action='submit' onSubmit={PostRegister}>
          <div>
            <label htmlFor='email' className='block'>
              Email
            </label>
            <input
              name='email'
              type='email'
              placeholder='Email'
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 valid:bg-green-200'
              required={true}
              value={title.email}
              onChange={handleChange}
            />
          </div>
          <div className='mt-4'>
            <label htmlFor='' className='block'>
              User Name
            </label>
            <input
              name='name'
              type='text'
              minLength={4}
              maxLength={12}
              placeholder='Password'
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 valid:bg-green-200'
              required={true}
              value={title.name}
              onChange={handleChange}
            />
          </div>
          <div className='mt-4'>
            <label htmlFor='' className='block'>
              Password
            </label>
            <input
              name='password'
              type='password'
              placeholder='Password'
              minLength={4}
              maxLength={12}
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
              required={true}
              value={title.password}
              onChange={handleChange}
            />
          </div>
          <div className='mt-4'>
            <label htmlFor='' className='block'>
              Confirm password
            </label>
            <input
              name='confirm'
              type='password'
              minLength={4}
              maxLength={12}
              placeholder='Password'
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
              required={true}
              value={confirm.value}
              onChange={confirm.onChange}
            />
          </div>
          <div className='flex item-baseline justify-between items-end'>
            <button
              onSubmit={(e) => {
                // e.preventDefault();
              }}
              type='submit'
              className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>
              Register
            </button>
            <a
              onClick={() => prop.showLogin(true)}
              type='button'
              className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Register };

const Login: React.FC<{ showLogin: Function }> = (props) => {
  const navigator = useNavigate();
  const [title, setTitle] = useState<User>({
    name: "",
    password: "",
    admin: false,
    role: Role.User
  });

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    let a = event.currentTarget.value;
    let item = event.currentTarget.name;
    // console.log(event.currentTarget.value);
    setTitle((prevState) => ({
      ...prevState,
      [item]: a
    }));
  }
  const LoginMiddleware = () => {};
  async function PostLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = getAccessToken();
    const resul = await fetch("http://localhost:8000/login", {
      method: "POST",
      body: JSON.stringify(title),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: token ? `bearer ${token}` : "",
        Accept: "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (resul.status === 200) {
      let data = await resul.json();
      localStorage.setItem("JAT", data.token);
      navigator('/Logged') 
    } else {
      console.log(resul.status);

      console.log("Wrong Loggin");
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='px-8 py-6 mt-4 text-left bg-white shadow-lg'>
        <h3 className='text-2xl font-bold text-center'>
          Login To Your Account
        </h3>
        <form action='submit' onSubmit={(e) => PostLogin(e)}>
          <div>
            <label htmlFor='email' className='block'>
              Name
            </label>
            <input
              name='name'
              type='text'
              placeholder='UserName'
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
              required={true}
              value={title.name}
              onChange={handleChange}
            />
          </div>
          <div className='mt-4'>
            <label htmlFor='' className='block'>
              Password
            </label>
            <input
              name='password'
              type='password'
              placeholder='Password'
              className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
              required={true}
              value={title.password}
              onChange={handleChange}
            />
          </div>
          <div className='flex item-baseline justify-between'>
            <button
              type='submit'
              className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>
              Login
            </button>
            {/* <a href='#' className='text-sm text-blue-600 hover:underline'>
              Forgot password?
            </a> */}
            <a
              className='py-2 text-sm text-blue-600 hover:underline cursor-pointer'
              //Modal Window for registration
              onClick={() => props.showLogin(false)}>
              New here?
            </a>
          </div>
          {/* <Register showen={showModal} /> */}
        </form>
      </div>
    </div>
  );
};

export { Login };

const LoginWrapper: FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  return showLogin ? (
    <Login showLogin={setShowLogin}></Login>
  ) : (
    <Register showLogin={setShowLogin}></Register>
  );
};
export default LoginWrapper;
