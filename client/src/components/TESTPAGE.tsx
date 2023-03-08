import { FC, useEffect } from "react";
import CuisineSearch from "./AutoCompletingCuisine";
import { IngredientForm } from "./InputIngredient";
export const TestPage: FC = () => {
  const sendJAT = async () => {
    let resu = await fetch("http://localhost:8000/login", {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("JAT")}`
      }
    });
    // let data = await resu.json();
    // localStorage.setItem("JAT",data.token) 
    // console.log(data.token);

  };
  useEffect(() => {
    sendJAT();
  }, []);
  return (<><div>YOU ARE LOGGED IN!!! <IngredientForm onSubmit={()=>{}}/></div></>);
};
