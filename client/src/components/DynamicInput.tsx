import React, { FC, useState } from "react"
import { useInput } from "../hooks/Hooks"
const DynamicInput = () => {
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

    return (
        <>
            {inputs.map((value: any, index: any) => {
                return (
                    <div className="flex flex-col items-center">
                        <input
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    </div>
                )
            })}
        </>
    );
};

export default DynamicInput;