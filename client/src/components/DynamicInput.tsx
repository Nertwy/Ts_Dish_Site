import React, { FC, useEffect, useState } from "react"
import { Ingredient, Recipe } from "../../../interfaces/Ingridient";
import { useInput } from "../hooks/Hooks"
interface DynamicInputProps {
    label: string,
    handleData?: Function
}
const DynamicInput: FC<DynamicInputProps> = ({ label, handleData }) => {
    const [inputs, setInputs] = useState<string[]>(['']);
    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        if (value && index === newInputs.length - 1) {
            // add new input if current input is filled and is the last input
            newInputs.push('');
        } else if (!value && newInputs.length > 1 && index === newInputs.length - 2) {
            // remove current input if it's empty and is the second to last input
            newInputs.splice(index, 1);
        }
        setInputs(newInputs);

    };
    useEffect(() => {
        if (!handleData) return
        handleData(inputs)
    }, [inputs])
    return (
        <div className="flex flex-col items-center border-2 w-full">
            {inputs.map((value: any, index: any) => {
                return (
                    <>
                        <label htmlFor={index + 1}>
                            {label}
                        </label>
                        <input
                            id={index}
                            placeholder={`${label} №...${index + 1}`}
                            className="p-1 rounded-lg border-transparent flex-1 text-center appearance-none border border-gray-400 w-full bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    </>
                )
            })}
        </div>
    );
};

export default DynamicInput;