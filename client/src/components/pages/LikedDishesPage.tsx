import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Card from "../Cards Logic/Card";
import { CardList } from "../Cards Logic/CardInfiniteList";
import ChangeableInput from "../ChangeableInput";
import StickyNav from "../StickyNav";
const SearchForLikedDishes: FC = () => {
    return (
        <div className="">
            <ChangeableInput className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 flex items-center" />
        </div>
    )
}
const LikedDishes: FC = () => {
    const dishes = useSelector((state: RootState) => state.list.dishes.filter((val) => val.like))
    return (
        <><StickyNav setFood={() => { }}></StickyNav>
            <SearchForLikedDishes></SearchForLikedDishes>
            <CardList dishes={dishes} />
        </>
    )
}
export default LikedDishes