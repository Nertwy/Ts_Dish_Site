import React, { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCuisine } from "../app/addDishSlice";
import { RootState } from "../app/store";
type Cuisine = {
    name: string;
    nationality: string;
};

const cuisines: Cuisine[] = [
    { name: "Afghan cuisine", nationality: "Afghanistan" },
    { name: "Algerian cuisine", nationality: "Algeria" },
    { name: "American cuisine", nationality: "United States" },
    { name: "Argentine cuisine", nationality: "Argentina" },
    { name: "Armenian cuisine", nationality: "Armenia" },
    { name: "Australian cuisine", nationality: "Australia" },
    { name: "Austrian cuisine", nationality: "Austria" },
    { name: "Azerbaijani cuisine", nationality: "Azerbaijan" },
    { name: "Bangladeshi cuisine", nationality: "Bangladesh" },
    { name: "Barbadian cuisine", nationality: "Barbados" },
    { name: "Belgian cuisine", nationality: "Belgium" },
    { name: "Belizean cuisine", nationality: "Belize" },
    { name: "Bolivian cuisine", nationality: "Bolivia" },
    { name: "Brazilian cuisine", nationality: "Brazil" },
    { name: "British cuisine", nationality: "United Kingdom" },
    { name: "Bulgarian cuisine", nationality: "Bulgaria" },
    { name: "Burmese cuisine", nationality: "Myanmar (Burma)" },
    { name: "Cambodian cuisine", nationality: "Cambodia" },
    { name: "Cameroonian cuisine", nationality: "Cameroon" },
    { name: "Canadian cuisine", nationality: "Canada" },
    { name: "Caribbean cuisine", nationality: "Caribbean islands" },
    { name: "Chilean cuisine", nationality: "Chile" },
    { name: "Chinese cuisine", nationality: "China" },
    { name: "Colombian cuisine", nationality: "Colombia" },
    { name: "Costa Rican cuisine", nationality: "Costa Rica" },
    { name: "Croatian cuisine", nationality: "Croatia" },
    { name: "Cuban cuisine", nationality: "Cuba" },
    { name: "Cypriot cuisine", nationality: "Cyprus" },
    { name: "Czech cuisine", nationality: "Czech Republic" },
    { name: "Danish cuisine", nationality: "Denmark" },
    { name: "Dominican cuisine", nationality: "Dominican Republic" },
    { name: "Dutch cuisine", nationality: "Netherlands" },
    { name: "Ecuadorian cuisine", nationality: "Ecuador" },
    { name: "Egyptian cuisine", nationality: "Egypt" },
    { name: "Emirati cuisine", nationality: "United Arab Emirates" },
    { name: "English cuisine", nationality: "England" },
    { name: "Ethiopian cuisine", nationality: "Ethiopia" },
    { name: "Finnish cuisine", nationality: "Finland" },
    { name: "French cuisine", nationality: "France" },
    { name: "Gambian cuisine", nationality: "Gambia" },
    { name: "Georgian cuisine", nationality: "Georgia" },
    { name: "German cuisine", nationality: "Germany" },
    { name: "Ghanaian cuisine", nationality: "Ghana" },]
export default function CuisineSearch() {
    const cuisineStore = useSelector((state: RootState) => state.addDish.dish.cuisine)
    const dispatch = useDispatch()
    // const [inputValue, setInputValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(changeCuisine(event.target.value))
        // setInputValue(event.target.value);
    }

    function handleDropdownOpen() {
        setIsDropdownOpen(true);
    }

    function handleDropdownClose() {
        setIsDropdownOpen(false);
    }

    function handleCuisineSelect(cuisine: Cuisine) {
        setSelectedCuisine(cuisine);
        // setInputValue(cuisine.name);
        dispatch(changeCuisine(cuisine.name))
        setIsDropdownOpen(false);
    }

    const filteredCuisines = cuisines.filter((cuisine: Cuisine) =>
        cuisine.name.toLowerCase().includes(cuisineStore.toLowerCase())
    );
    return (
        <div className="w-full">
            <input
                className="border-gray-300 border-2 rounded-md p-2 w-full"
                type="text"
                placeholder="Search for a cuisine"
                value={cuisineStore}
                onChange={handleInputChange}
                onFocus={handleDropdownOpen}
                onBlur={handleDropdownClose}
            />
            {isDropdownOpen && (
                <div className="absolute z-10 max-h-28 overflow-y-auto border-gray-300 border-2 rounded-md p-2 bg-white mt-2 w-1/5">
                    <ul className="py-1">
                        {filteredCuisines.map((cuisine: Cuisine) => (
                            <li
                                key={cuisine.name}
                                className="py-1 cursor-pointer hover:bg-gray-200"
                                onMouseDown={() => handleCuisineSelect(cuisine)}
                            >
                                {cuisine.name} ({cuisine.nationality})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}