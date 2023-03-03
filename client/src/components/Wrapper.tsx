import { FC, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import { FoodAll } from "../../../interfaces/FoodsAll";
import AddDish from "./AddDish";
import DishPage from "./DishPage";
import Home from "./Home";
import Login from "./Login";
import { TestPage } from "./TESTPAGE";

const Wrapper: FC = () => {
  const handleCardData = (food: FoodAll) => {
    SetCardData(food);
  };
  let Dish: FoodAll = {
    id: 0,
    cuisine: "",
    Ingridiences: [],
    slug: "",
    url: "",
    transport: handleCardData
  };
  let [cardData, SetCardData] = useState<FoodAll>(Dish);
  useEffect(() => {
    // console.log(cardData);
  }, [cardData]);

  return (
    //Pass a state hook to Home page and insert to it values of a card pressed and then pass it to DIsh page
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Home Dish={Dish} />}></Route>
        <Route path='/dish' element={<DishPage {...cardData} />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/Logged' element={<TestPage />}></Route>
        <Route path='/AddDish' element={<AddDish />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Wrapper;
