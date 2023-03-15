import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dish } from "../../../../interfaces/Ingridient";
import { fetchCard } from "../../api/api";
import { AppDispatch, RootState } from "../../app/store";
import { addDishToList } from "../../app/CardListSlice";
import Card from "./Card";
interface CardListProps {
  dishes: Dish[]
}
export const CardList: FC<CardListProps> = ({ dishes }) => {
  return (
    <div className=" bg-slate-100 grid auto-cols-fr   xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      {dishes.map((val, index) => {
        return <Card key={index} {...val} />
      })}
    </div>
  )
}
const CardInfiniteList: FC<{ func: Function | undefined }> = (prop: {
  func: Function | undefined;
}) => {
  const loading = useSelector((state: RootState) => state.list.loading)
  const cards = useSelector((state: RootState) => state.list.dishes)
  const dispatch: AppDispatch = useDispatch()
  const fetchCards = async () => {
    for (let i = cards.length; i < cards.length + 25; i++) {
      let dish = await fetchCard(i)
      dispatch(addDishToList(dish))
    }
  };
  useEffect(() => {
    fetchCards();
  }, []);
  return (
    <>
      {loading ? (
        <div className="">Loading...</div>
      ) : (
        <>
          <CardList dishes={cards} />
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
export default CardInfiniteList;
