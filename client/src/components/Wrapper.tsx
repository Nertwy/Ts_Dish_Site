import { FC, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate, useRoutes } from "react-router-dom";
import { Dish } from "../../../interfaces/Ingridient";
import Counter from "../features/counter/Counter";
import AddDish from "./AddDish";
import DishPage from "./pages/DishPage";
import Home from "./pages/HomePage";
import Login from "./Login";
import { TestPage } from "./TESTPAGE";

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
  const handleSetFood = (food:Dish)=>{
    SetCardData(food)
  }
  return (
    //Pass a state hook to Home page and insert to it values of a card pressed and then pass it to DIsh page
    <BrowserRouter basename='/'>
      <Routes>
        <Route path="/test" element={<Counter></Counter>}/>
        <Route path='/' element={<Home Dish={cardData} />}></Route>
        <Route path='/dish' element={<DishPage dish={cardData}/>}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/Logged' element={<TestPage />}></Route>
        <Route path='/AddDish' element={<AddDish />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Wrapper;
