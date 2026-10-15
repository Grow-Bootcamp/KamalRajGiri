
import { useState } from "react";

type Fruit = {
    id: number;
    name: string;
};

function FavoriteFruits() {
    const [fruitName, setFruitName] = useState("");
    const [fruits, setFruits] = useState<Fruit[]>([
        { id: 1, name: "Apple" },
        { id: 2, name: "Mango" },
    ]);

    function addFruit() {
        const trimmedName = fruitName.trim();
        if (trimmedName === "") {
            return;
        }

        const newFruit: Fruit = {
            id: Date.now(),
            name: trimmedName,
        };

        setFruits((previousFruits) => [
            ...previousFruits,
            newFruit,
        ]);

        setFruitName("");

    }

    function removeFruit(fruitId: number) {
        setFruits((previousFruits) =>
            previousFruits.filter((fruit) => fruit.id !== fruitId)
        );
    }

    return (
        <section>
            <h2>My Favorite Fruits</h2>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    addFruit();
                }}
            >
                <label htmlFor="fruitName">Fruit name:</label>

                <input
                    id="fruitName"
                    value={fruitName}
                    onChange={(event) => setFruitName(event.target.value)}
                    placeholder="Enter a fruit"
                />

                <button type="submit">Add Fruit</button>
            </form>

            <p>Total fruits: {fruits.length}</p>

            {fruits.length === 0 ? (
                <p>No favorite fruits added yet.</p>
            ) : (
                <ul>
                    {fruits.map((fruit) => (
                        <li key={fruit.id}>
                            {fruit.name}
                            <button
                                type="button"
                                onClick={() => removeFruit(fruit.id)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default FavoriteFruits;
