import { Dish } from "../../../interfaces/Ingridient";

export const fetchCard = async (id: number): Promise<Dish> => {
    let responce = await fetch(`http://localhost:8000/data?id=${id}`);
    let data: Dish = await responce.json();
    let cardInfo: Dish = {
        id: id,
        name: data.name,
        cuisine: data.cuisine,
        url: data.url,
        ingredients: data.ingredients,
        slug: data.slug,
        recipes: data.recipes,
        // transport: prop.func,
    };
    // localStorage.setItem("food", JSON.stringify(cardInfo));
    return cardInfo;
};