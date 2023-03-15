import React, { FC, useState } from "react";
interface InputProps {
  className?: string,
  data?: string
}
const ChangeableInput: FC<InputProps> = ({ data, className}) => {
  const [newData, setName] = useState<string | undefined>(data);
  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    let a = event.currentTarget.value;
    setName(a);
  }
  return (
    <div className={className}>
      <input value={data} onChange={handleChange}></input>
    </div>
  );
};
export default ChangeableInput;
