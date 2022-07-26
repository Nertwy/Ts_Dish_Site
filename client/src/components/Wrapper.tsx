import { FC, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import { FoodAll } from "../../../interfaces/FoodsAll";
import DishPage from "./DishPage";
import Home from "./Home";


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
        <Route
          path='/'
          element={<Home Dish={Dish} />}></Route>
        <Route path='/dish' element={<DishPage {...cardData} />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Wrapper;
