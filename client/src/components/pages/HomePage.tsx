import React, { FC, StrictMode, useEffect, useState } from "react";
import Footer from "../Footer";
import StickyNav from "../StickyNav";
import img from "../../images/Logo.png";
import { Dish } from "../../../../interfaces/Ingridient";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  toggleDarkMode,
  useAppDispatch,
} from "../../app/store";
import CardList from "../Cards Logic/CardInfiniteList";
import CardInfiniteList from "../Cards Logic/CardInfiniteList";
import { login, setUserToken } from "../../app/UserSlice";
import { apiGetUserLike } from "../../api/api";
import { modifyDishLike, pushLikedDishes } from "../../app/CardListSlice";
//Dark\Light themes
interface DishLikes {
  likes: {
    id: number;
    dish_id: number;
    user_id: number;
  }[];
}
const Header: FC<{ setID?: Function }> = (props: { setID?: Function }) => {
  const theme = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch: AppDispatch = useDispatch();
  const handleTheme = () => {
    console.log(theme);
    dispatch(toggleDarkMode());
  };
  return (
    <header
      className="top-0 h-auto w-auto text-center bg-green-500  overflow-hidden drop-shadow dark:bg-gray-600"
      onClick={handleTheme}
    >
      <h2 className="font-fasthand text-center text-6xl p-10 font-bold">
        Welcome to Home Page!
      </h2>
      <img
        src={img}
        className="h-24  mx-auto  transition-transform duration-200 hover:scale-110 z-10"
        alt="Dish for wish"
      />
    </header>
  );
};

const Home: FC<{ Dish: Dish; setID?: Function }> = (props: {
  Dish: Dish;
  setID?: Function;
}) => {
  useEffect(() => {}, []);
  return (
    <StrictMode>
      <Header></Header>
      <StickyNav setFood={props.Dish.transport!}></StickyNav>
      <CardInfiniteList
        {...props.Dish}
        func={props.Dish.transport}
      ></CardInfiniteList>
      <Footer></Footer>
    </StrictMode>
  );
};
export default Home;
