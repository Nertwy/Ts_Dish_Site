import React, { FC, FormEvent, HtmlHTMLAttributes, useState } from "react";
import { Dish, Ingredient, Recipe } from "../../../../interfaces/Ingridient";
import { transliterate, slugify } from "transliteration"
import { useInput } from "../../hooks/Hooks";
import DynamicInput from "../DynamicInput";
import CuisineSearch from "../AutoCompletingCuisine";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { handleIngChange, handleRecipeChange, handleNameChange } from "../../app/addDishSlice";
interface FormData {
  picture: File | null,
  dish: Dish
}
const AddDish: FC = () => {
  const dispatch = useDispatch()
  const dishForm = useSelector((state: RootState) => {
    return state.addDish
  })
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(handleNameChange(e.target.value))
  }
  const uploadPicture = (e: React.FormEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const image = e.currentTarget.files![0];
    formData.append("image", image);
    const options: RequestInit = {
      body: formData,
      method: "POST"
    };

    fetch("URL to...", options);
  };
  const handleRecipeSubmit = (args: Recipe) => {
    dispatch(handleRecipeChange(args))
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    fetch("http://localhost:8000/post-food", {
      method: "POST",
      body: formdata
    })
  }
  const handleIngSubmit = (args: Ingredient[]) => {
    dispatch(handleIngChange(args))
  }
  return (
    <div className="flex justify-center content-center">
      <form encType='multipart/form-data' method='post' onSubmit={handleSubmit} className='flex items-center flex-col w-1/3  space-y-5'>
        <input
          // required
          placeholder="Name of the dish"
          value={dishForm.dish.name}
          onChange={handleName}
          className="mt-5 p-5 rounded-lg border-transparent flex-1 text-center appearance-none border
           border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 
           shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 
           focus:border-transparent" />
        <CuisineSearch />
        <DynamicInput label="Steps" handleData={handleRecipeSubmit} />
        <DynamicInput label="Ingredients" handleData={handleIngSubmit} />
        <input
          // required
          className=""
          type={"file"}
          accept={"image/png, image/gif, image/jpeg"}></input>
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
};
export default AddDish;


