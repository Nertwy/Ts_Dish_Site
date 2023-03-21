import React, { FC, FormEvent, HtmlHTMLAttributes, useState } from "react";
import { Dish, Ingredient, Recipe, ClientDish } from "../../../../interfaces/Ingridient";
import { useInput } from "../../hooks/Hooks";
import DynamicInput from "../DynamicInput";
import CuisineSearch from "../AutoCompletingCuisine";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { handleIngChange, handleRecipeChange, handleNameChange, setSlug } from "../../app/addDishSlice";
import { slugify } from "transliteration";
import axios from 'axios'
interface FormData {
  picture: File | null,
  dish: Dish
}
const AddDish: FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const dispatch = useDispatch()
  const dishForm = useSelector((state: RootState) => {
    return state.addDish
  })
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSlug(slugify(e.target.value)))
    dispatch(handleNameChange(e.target.value))
  }

  const uploadPicture = (e: React.FormEvent<HTMLInputElement>) => {
    const image = e.currentTarget.files![0];
    setFile(image)
  };
  const handleRecipeSubmit = (args: string[]) => {
    dispatch(handleRecipeChange(args))
  }
  const handleIngSubmit = (args: string[]) => {
    const ingArr: Ingredient[] = []
    args.forEach((val) => {
      ingArr.push({
        amount: 0,
        id: 0,
        name: val,
        measureUnit: ""
      })
    })
    dispatch(handleIngChange(ingArr))
  }
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    const formData = new FormData();
    e.preventDefault()
    const postDish: ClientDish = {
      cuisine: dishForm.dish.cuisine,
      ingredients: dishForm.dish.ingredients,
      like: false,
      name: dishForm.dish.name,
      recipes: dishForm.dish.recipes!,
      slug: dishForm.dish.slug
    }
    if (file) {
      const filename = encodeURIComponent(file?.name)
      formData.append("file", file, filename)
    }
    formData.append("dish", JSON.stringify(postDish))
    try {
      const res: object = await axios.post("http://localhost:8000/post-food", formData, {
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8"
        }
      })
      console.log(res);

    } catch (error) {
      console.error(error);

    }

  }

  return (
    <div className="h-screen mx-auto">
      <div className="flex justify-center content-center">
        <form encType='multipart/form-data ; charset=utf-8' method='post' onSubmit={handleSubmit} className='flex items-center flex-col w-1/3  space-y-5'>
          <input
            // required
            placeholder="Name of the dish"
            value={dishForm.dish.name}
            onChange={handleName}
            className="mt-5 p-5 rounded-lg border-transparent flex-1 text-center appearance-none border
           border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 
           shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-emerald-500
           focus:border-transparent" />
          <CuisineSearch />
          <DynamicInput label="Recipe step" handleData={handleRecipeSubmit} />
          <DynamicInput label="Ingredients" handleData={handleIngSubmit} />
          <input
            onChange={uploadPicture}
            // required
            className=""
            type={"file"}
            //accept=".jpg, .jpeg, .png"
            accept={"image/png, image/gif, image/jpeg"}></input>
          <button type='submit'>Upload</button>
        </form>
      </div>
    </div>
  );
};
export default AddDish;


