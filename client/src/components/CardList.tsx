import React, { FC, useEffect, useState } from "react";
import { FoodAll } from "../../../interfaces/FoodsAll";
import Card from "./Card";
import img from "../images/Background.jpg";

const CardList: FC<{ func: Function | undefined }> = (prop: {
  func: Function | undefined;
}) => {
  let [loading, setLoading] = useState(true);
  let [cards, SetCards] = useState<FoodAll[]>([]);

  const fetchCards = async () => {
    let newCards: FoodAll[] = [];
    for (let i = cards.length; i < cards.length + 30; i++) {
      newCards.push(await fetchCard(i));
    }
    SetCards([...cards, ...newCards]);
    setLoading(false);
  };
  const fetchCard = async (id: number): Promise<FoodAll> => {
    let responce = await fetch(`http://localhost:8000/data/?id=${id}`);
    let data = await responce.json();
    let cardInfo: FoodAll = {
      id: id,
      name: data.name,
      cuisine: data.cuisine.name,
      url: data.imageUrl,
      Ingridiences: data.composition,
      slug: data.slug,
      transport: prop.func
    };
    return cardInfo;
  };
  useEffect(() => {
    fetchCards();
  }, []);
  return (
    //lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2
    <>
      {loading ? (
        <div className=''>Loading...</div>
      ) : (
        <>
          <div className=' bg-slate-100 grid auto-cols-fr   xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 '>
            {cards.map((elem, index) => {
              // console.log(cards.length);
              return <Card key={index} {...elem}></Card>;
            })}
          </div>
          <div className='text-center self-center Аbg-slate-100'>
            <button
              onClick={fetchCards}
              type='button'
              className='text-gray-900 bg-gradient-to-r from-green-200 via-green-400 to-green-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
              Load More!
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default CardList;
