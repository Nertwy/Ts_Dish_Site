import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dish } from "../../../interfaces/Ingridient";
import { AppDispatch, RootState, toggleDarkMode } from "../app/store";
import img from "../images/Logo.png";
// Сделать случайное блюдо  Math.floor(Math.random() * 101); от 0 до 100

const ToggleSwitch: FC = () => {
  const like = useSelector((state: RootState) => state)
  return (
    <label
      htmlFor="default-toggle"
      className="inline-flex relative items-center cursor-pointer"
    >
      <input
        type="checkbox"
        value=""
        id="default-toggle"
        className="sr-only peer"
      />
      <div onClick={() => { }}
        className="
      w-11 h-6 bg-gray-200 peer-focus:outline-none 
      peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
      rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
       peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span className="ml-3 text-sm font-medium text-gray-900">
        ☀️
      </span>
    </label>
  );
};
const StickyNav: FC<{ setFood: Function }> = (props: {
  setFood?: Function;
}) => {
  const userLogged = useSelector((state: RootState) => state.user.logged)
  const randNum = async (setFood: Function) => {
    let id = Math.floor(100 * Math.random());
    let responce = await fetch(`http://localhost:8000/data/?id=${id}`);
    let data: Dish = await responce.json();
    let cardInfo: Dish = {
      id: id,
      name: data.name,
      cuisine: data.cuisine,
      url: data.url,
      ingredients: data.ingredients,
      slug: data.slug,
      recipes: data.recipes,
    };
    setFood(cardInfo);
    localStorage.setItem("food", JSON.stringify(cardInfo));
    navigate("/dish");
  };
  const navigate = useNavigate();
  return (
    <nav className="font-fasthand sticky top-0   py-2 drop-shadow bg-green-700 opacity-70 text-center space-x-16 text-3xl nav-show-anim z-50 shadow-sm dark:shadow-white">
      <a
        onClick={() => {
          console.log(window.location.href);
          if (window.location.href.endsWith("/")) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            navigate("/");
          }
        }}
        className="border-2 border-transparent px-2  hover:border-2  rounded-xl transition hover:cursor-pointer border-opacity-0 hover:border-opacity-100 hover:text-green-400 duration-200"
      >
        Home
      </a>
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          randNum(props.setFood!);
        }}
        className="border-2 border-transparent px-2 hover:border-opacity-100 hover:text-green-400 duration-200  rounded-xl transition hover:duration-300 hover:cursor-pointer"
      >
        Random Recipes
      </a>
      <a
        onClick={() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          })
        }
        className="border-2 border-transparent px-2 hover:border-2 hover:border-opacity-100 hover:text-green-400 duration-200 rounded-xl transition hover:duration-300 hover:cursor-pointer"
      >
        About
      </a>
      <a
        className="border-2 border-transparent px-2 hover:border-opacity-100 hover:text-green-400 duration-200 rounded-xl transition hover:duration-300 hover:cursor-pointer"
        onClick={() => navigate("/Login")}
      >
        Login
      </a>
      {userLogged ? <a
        onClick={() => navigate("/like")}
        className="border-2 border-transparent px-2 hover:border-opacity-100 hover:text-green-400 duration-200 rounded-xl transition hover:duration-300 hover:cursor-pointer">
        Liked
      </a> : <></>}

      {userLogged ? <a
        className="border-2 border-transparent px-2 hover:border-opacity-100 hover:text-green-400 duration-200 rounded-xl transition hover:duration-300 hover:cursor-pointer "
        onClick={() => navigate("/AddDish")}>Add Dish</a> : <></>}
      {/* <ToggleSwitch></ToggleSwitch> */}
    </nav>

  );
};
export default StickyNav;
