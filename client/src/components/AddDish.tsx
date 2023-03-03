import React, { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import food from "./FoodDB.json";
const AddDish: FC = () => {
  const navigator = useNavigate();
  const imageUrl = "";
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
  return (
    <>
      <div>
        <form encType='multipart/form-data' method='post' onSubmit={() => {}}>
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