import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dish } from "../../../../interfaces/Ingridient";
import { RootState } from "../../app/store";
import HeartButton from "./HeartContainer";
import img from "../../images/Background.jpg";
const Card: FC<Dish> = (props) => {
  const [url,setUrl] = useState(props.url)
  const handleError = ()=>{
    if(props.url?.lastIndexOf("/undefined")!>= 0){
      setUrl(img)
    }
    // console.log(url);
  }
  const navigate = useNavigate();
  const style =
    "transition duration-200 shadow hover:shadow-md w-1/6 h-80 overflow-hidden m-4 float-left ml-10 cursor-pointer card-show-anim sm:w-auto sm:justify-center sm:left-1/2";
  return (
    <div className="card-show-anim bg-slate-200 dark:bg-slate-700">
      <div
        className='flex flex-col w-auto p-7 rounded-md  transition duration-200 m-3 shadow-md hover:shadow-md  cursor-pointer hover:scale-110 hover:z-10 dark:text-white dark:shadow-white'
      //Cannot invoke an object which is possibly 'undefined' in TS without ?.
      >
        <div className='h-96 overflow-hidden'>
          <img
            src={url}
            alt='Meal'
            className='h-full w-full'
            onError={handleError}
            onClick={() => {
              localStorage.setItem("food", JSON.stringify(props))
              navigate("/dish");
            }}
          />
        </div>
        <div className='flex-col h-auto w-auto'>
          <h3>
            <b>{props.name}</b>
          </h3>
          <p>{props.cuisine}</p>
          <div className="float-right ">
            <HeartButton isLiked={props.like} id={props.id!} numberOfLikes={props.likes!}/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
