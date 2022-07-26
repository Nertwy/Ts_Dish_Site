import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardInt from "../../../interfaces/CardInt";
import { FoodAll } from "../../../interfaces/FoodsAll";
const Card: FC<FoodAll> = (props) => {
  const navigate = useNavigate();

  const style =
    "transition duration-200 shadow hover:shadow-md w-1/6 h-80 overflow-hidden m-4 float-left ml-10 cursor-pointer card-show-anim sm:w-auto sm:justify-center sm:left-1/2";
  useEffect(() => {
    // console.log(props);
  });
  return (
    <div className="card-show-anim">
      <div
        className='flex flex-col w-auto p-7 rounded-md  transition duration-200 shadow hover:shadow-md m-3 cursor-pointer hover:scale-110 hover:z-10'
        //Cannot invoke an object which is possibly 'undefined' in TS without ?.
      >
        <div className='h-96 overflow-hidden'>
          <img
            src={props.url}
            alt='Meal'
            className='h-full w-full'
            onClick={() => {
              props.transport?.(props);
              navigate("/dish");
            }}
          />
        </div>
        <div className='flex-col h-auto w-auto'>
          <h3>
            <b>{props.name}</b>
          </h3>
          <p>{props.cuisine}</p>
        </div>
      </div>
    </div>
  );
};
export default Card;
