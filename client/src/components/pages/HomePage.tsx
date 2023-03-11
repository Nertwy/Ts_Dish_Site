import React, { FC, StrictMode, useEffect, useState } from "react";
import CardList from "../Cards Logic/CardList";
import Footer from "../Footer";
import StickyNav from "../StickyNav";
import img from "../../images/Logo.png";
import { Dish } from "../../../../interfaces/Ingridient";
import { useNavigate } from "react-router-dom";
//Dark\Light themes

const Header: FC<{ setID?: Function }> = (props: { setID?: Function }) => {
  return (
    <header className="top-0 h-auto w-auto text-center bg-green-500  overflow-hidden drop-shadow ">
      <h2 className="text-center text-6xl p-10 font-bold">
        Welcome to Home Page!
      </h2>
      <img src={img} className="h-24  mx-auto" alt="Dish for wish" />
    </header>
  );
};

const Home: FC<{ Dish: Dish; setID?: Function }> = (props: {
  Dish: Dish;
  setID?: Function;
}) => {
  const navigate = useNavigate();
  const randNum = async (callback: Function) => {
    let id = Math.floor(100 * Math.random());
    let responce = await fetch(`http://localhost:8000/data/?id=${id}`);
    let data: Dish = await responce.json();
    let cardInfo: Dish = {
      id: id,
      recipes: data.recipes,
      name: data.name,
      cuisine: data.cuisine,
      url: data.url,
      ingredients: data.ingredients,
      slug: data.slug,
      transport: props.Dish.transport,
    };
    // localStorage.setItem("food", JSON.stringify(cardInfo));
    callback(cardInfo);
    navigate("/dish");
  };
  let [token, setToken] = useState();
  const handleRefresh = async () => {
    let a = await fetch("http://localhost:8000/refresh_token", {
      method: "POST",
      credentials: "include",
    });
    let b = await a.json();
    console.log(b);
  };
  useEffect(() => {
    handleRefresh();
  }, []);
  return (
    <StrictMode>
      <Header></Header>
      <StickyNav setFood={props.Dish.transport!}></StickyNav>
      <CardList {...props.Dish} func={props.Dish.transport}></CardList>
      <Footer></Footer>
    </StrictMode>
  );
};
export default Home;
