import React, { FC, FormEvent, useState } from "react";
import { Dish } from "../../../../interfaces/Ingridient";
import { transliterate, slugify } from "transliteration"
import { useInput } from "../../hooks/Hooks";
import DynamicInput from "../DynamicInput";

const AddDish: FC = () => {
  const slugInput = useInput("")
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
  // const dish: Dish = {

  // }
  return (
    <>
      <div>
        <form encType='multipart/form-data' method='post' onSubmit={() => { }}>
          <input placeholder="Name of the dish" value={slugInput.value} onChange={slugInput.onChange} />
          <input readOnly value={slugify(slugInput.value)} />
          <DynamicInput/>
            <input
            type={"file"}
            accept={"image/png, image/gif, image/jpeg"}></input>
          <button type='submit'>Upload</button>
        </form>
      </div>
    </>
  );
};
export default AddDish;


