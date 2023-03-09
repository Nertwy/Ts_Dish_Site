import { FC, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate, useRoutes } from "react-router-dom";
import { Dish } from "../../../interfaces/Ingridient";
import AddDish from "./AddDish";
import DishPage from "./DishPage";
import Home from "./Home";
import Login from "./Login";
import { TestPage } from "./TESTPAGE";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer:{
    
  }
})

const Wrapper: FC = () => {
  const handleCardData = (food: Dish) => {
    SetCardData(food);
  };

  let Dish: Dish = {
    id: 0,
    name: "",
    cuisine: "",
    ingredients: [],
    slug: "",
    url: "",
    transport: handleCardData
  };
  let [cardData, SetCardData] = useState<Dish>(Dish);
  useEffect(() => {
    // console.log(cardData);
  }, [cardData]);

  return (
    //Pass a state hook to Home page and insert to it values of a card pressed and then pass it to DIsh page
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Home Dish={Dish} />}></Route>
        <Route path='/dish' element={<DishPage dish={cardData} />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/Logged' element={<TestPage />}></Route>
        <Route path='/AddDish' element={<AddDish />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Wrapper;
