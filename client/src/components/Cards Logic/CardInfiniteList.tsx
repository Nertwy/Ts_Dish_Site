import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dish } from "../../../../interfaces/Ingridient";
import { apiFetchCard, apiGetUserLike } from "../../api/api";
import { AppDispatch, RootState } from "../../app/store";
import { addDishToList, modifyDishLike, pushLikedDishes } from "../../app/CardListSlice";
import Card from "./Card";
import Loader from "../Loader";
import { getAccessToken } from "../../AccessToken";
import { loginApi } from "../Login";
import { login } from "../../app/UserSlice";
interface CardListProps {
  dishes: Dish[];
}
export const CardList: FC<CardListProps> = ({ dishes }) => {
  return (
    <div className=" bg-slate-100 grid auto-cols-fr   xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 dark:bg-slate-700 py-8">
      {dishes.map((val, index) => {
        return <Card key={index} {...val} />;
      })}
    </div>
  );
};
const CardInfiniteList: FC<{ func: Function | undefined }> = (prop: {
  func: Function | undefined;
}) => {
  const likes = useSelector((state: RootState) => state.list.likedDishes);
  const loading = useSelector((state: RootState) => state.list.loading);
  const cards = useSelector((state: RootState) => state.list.dishes);
  const dispatch: AppDispatch = useDispatch();
  const fetchCards = async () => {
    for (let i = cards.length; i < cards.length + 25; i++) {
      let dish: Dish = await apiFetchCard(i);
      likes.forEach((val) => {
        if (dish.id === val.dish_id) dish.like = true;
      });
      dispatch(addDishToList(dish));
    }
    await handleFetch()
  };
  interface DishLikes {
    likes: {
      id: number;
      dish_id: number;
      user_id: number;
    }[];
  }
  const handleFetch = async () => {
    const resul = await apiGetUserLike();
    if (resul.status !== 200) {
      return;
    }
    const data: DishLikes = resul.data;
    console.log(data);
    data.likes.forEach((val) => dispatch(modifyDishLike(val.dish_id)));
    dispatch(pushLikedDishes(data.likes));
    dispatch(login());
  };
  useEffect(() => {
    fetchCards();
  }, []);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <>
          <CardList dishes={cards} />
          <div className="text-center self-center bg-slate-100 dark:bg-slate-700">
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
