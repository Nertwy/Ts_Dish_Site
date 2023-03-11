import React, { FC, useEffect, useState } from "react";
import { Dish } from "../../../interfaces/Ingridient";
import Card from "./Card";
import HeartContainer from "./HeartContainer";

const CardList: FC<{ func: Function | undefined }> = (prop: {
  func: Function | undefined;
}) => {
  let [loading, setLoading] = useState(true);
  let [cards, SetCards] = useState<Dish[]>([]);

  const fetchCards = async () => {
    let newCards: Dish[] = [];
    for (let i = cards.length + 1; i < cards.length + 30; i++) {
      newCards.push(await fetchCard(i));
    }
    SetCards([...cards, ...newCards]);
    setLoading(false);
  };
  const fetchCard = async (id: number): Promise<Dish> => {
    let responce = await fetch(`http://localhost:8000/data?id=${id}`);
    let data: Dish = await responce.json();
    let cardInfo: Dish = {
      id: id,
      name: data.name,
      cuisine: data.cuisine,
      url: data.url,
      ingredients: data.ingredients,
      slug: data.slug,
      recipes: data.recipes,
      transport: prop.func,
    };
    // localStorage.setItem("food", JSON.stringify(cardInfo));
    return cardInfo;
  };
  useEffect(() => {
    fetchCards();
  }, []);
  return (
    //lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2
    <>
      {loading ? (
        <div className="">Loading...</div>
      ) : (
        <>
          <div className=" bg-slate-100 grid auto-cols-fr   xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
            {cards.map((elem, index) => {
              return <Card key={index} {...elem} ></Card>;
            })}
          </div>
          <div className="text-center self-center Аbg-slate-100">
            <button
              onClick={fetchCards}
              type="button"
              className="text-gray-900 bg-gradient-to-r from-green-200 via-green-400 to-green-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Load More!
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default CardList;
