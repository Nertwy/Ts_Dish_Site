import React from "react";
import { useState } from "react";
import { Ingredient } from "../../../interfaces/Ingridient";

interface Props {
    onSubmit: (ingredient: Ingredient) => void;
}

export const IngredientForm = ({ onSubmit }: Props) => {
    const [amount, setAmount] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [measureUnit, setMeasureUnit] = useState<string>("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const newIngredient: Ingredient = { amount, id, name, measureUnit };
        onSubmit(newIngredient);
        setAmount(0);
        setId(0);
        setName("");
        setMeasureUnit("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Amount:
                <input
                    type="number"
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value))}
                />
            </label>
            <br />
            <br />
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </label>
            <br />
            <label>
                Measure unit:
                <input
                    type="text"
                    value={measureUnit}
                    onChange={(event) => setMeasureUnit(event.target.value)}
                />
            </label>
            <br />
            <button type="submit">Add Ingredient</button>
        </form>
    );
}