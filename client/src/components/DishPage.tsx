import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dish, Ingredient } from "../../../interfaces/Ingridient";
import Card from "./Card";
import Ingridients from "./Ingridients";
import StickyNav from "./StickyNav";
const DishPage: FC<{ dish: Dish }> = (props) => {
  const [ingredient, setIngredient] = useState<Ingredient[]>(
    props.dish.ingredients
  );
  const [allFood, setAllFood] = useState<Dish>({
    cuisine: props.dish.cuisine,
    id: props.dish.id,
    url: props.dish.url,
    slug: props.dish.slug,
    ingredients: props.dish.ingredients,
    name: props.dish.name,
    recipes: props.dish.recipes,
  });
  useEffect(() => {
    // console.log(allFood.id);

    if (!props.dish.ingredients.length) {
      let res: Ingredient[] = JSON.parse(localStorage.getItem("ing")!);
      let food: Dish = JSON.parse(localStorage.getItem("food")!);
      setIngredient(res);
      setAllFood(food);
    } else {
      localStorage.setItem("ing", JSON.stringify(ingredient));
      localStorage.setItem("food", JSON.stringify(props));
    }
    // console.log(props);
  }, []);
  //Сделать от 2х до 5 нормальные названия
  //bg-[url('./src/images/Background.jpg')] bg-cover Просто очень плохо
  return (
    <>
      <StickyNav></StickyNav>
      <div className='w-screen flex items-center flex-col bg-gray-200 '>
        <Card {...allFood} transport={() => { }} />
        <h3 className='text-xl font-semibold'>Ингридиенты</h3>
        <div className='mb-3 text flex-col font-serif pb-6 lg:w-1/3 md:w-2/4 sm:w-3/5'>
          {ingredient.map((e, i) => (
            <div className='flex justify-between' key={i}>
              <div className='float-left'>
                {e.amount === 0 ? null : e.amount} {e.measureUnit}
              </div>
              <div className="float-right">{e.name}</div>
            </div>
          ))}
        </div>
        <h1 className='text-2xl font-bold'>Рецепт приготовления:</h1>
        <div className='w-auto  border-slate-800 p-2 border-2 border-spacing-3 m-2'>
          <ol
            className='list-decimal pl-7 space-y-3 font-mono text-lg'
            type='1'>
            {
              allFood.recipes?.step.map((elem, index) => (
                <li key={index} className='list-decimal'>
                  {elem}
                </li>
              ))
            }
          </ol>
        </div>
      </div>
    </>
  );
};
export default DishPage;
