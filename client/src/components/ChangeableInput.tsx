import React, { FC, useState } from "react";
import { InputData } from "../../../types/types";
const ChangeableInput: FC<InputData> = ({ data }) => {
  const [newData, setName] = useState<InputData>({ data: data });
  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    let a = event.currentTarget.value;
    setName({ data: a });
  }
  return (
    <div>
      <input value={newData.data} onChange={handleChange}></input>
    </div>
  );
};
export default ChangeableInput;
