import React, { FC, StrictMode, useEffect, useState } from "react";
import CardList from "./CardList";
import Footer from "./Footer";
import { FoodAll } from "../../../interfaces/FoodsAll";
import StickyNav from "./StickyNav";
import img from "../images/Logo.png";
//Dark\Light themes

const Header: FC<{ setID?: Function }> = (props: { setID?: Function }) => {
  return (
    <header className='top-0 h-auto w-auto text-center bg-green-500  overflow-hidden drop-shadow '>
      <h2 className='text-center text-6xl p-10 font-bold'>
        Welcome to Home Page!
      </h2>
      <img src={img} className='h-24  mx-auto' alt='Dish for wish' />
    </header>
  );
};

const Home: FC<{Dish:FoodAll,setID?:Function}> = (props:{Dish: FoodAll,setID?:Function }) => {

  let [token,setToken] = useState();
  const handleRefresh = async () => {
    let a = await fetch("http://localhost:8000/refresh_token", {
      method: "POST",
      credentials: "include"
    });
    let b = await a.json();
    console.log(b);
  };
  useEffect(()=>{
    handleRefresh()
  },[])
  return (
    <StrictMode>
      <Header></Header>
      <StickyNav setFood={props.Dish.transport} ></StickyNav>
      <CardList {...props.Dish} func={props.Dish.transport}></CardList>
      <Footer></Footer>
    </StrictMode>
  );
};
export default Home;
