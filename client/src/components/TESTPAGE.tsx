import { FC, useEffect } from "react";
import CuisineSearch from "./AutoCompletingCuisine";
import { IngredientForm } from "./InputIngredient";
export const TestPage: FC = () => {
  const sendJAT = async () => {
    let resu = await fetch("http://localhost:8000/login", {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("JAT")}`,
      },
    });
  };
  useEffect(() => {
    sendJAT();
  }, []);
  return (
    <>
      <div>
        YOU ARE LOGGED IN!!! <IngredientForm onSubmit={() => {}} />
        <CuisineSearch />
      </div>
    </>
  );
};
