import { useState } from "react";



function DisplayFruits() {
    const [fruits, setFruits] = useState([
        "apple",
        "Banana",
        "Mango",
    ]);

function addFruit() {
  setFruits((previousFruits) => [
    ...previousFruits,
    "Banana",
  ]);
}

function removeFruit(fruitToRemove: string) {
  setFruits((previousFruits) =>
    previousFruits.filter((fruit) => fruit !== fruitToRemove)
  );
}


    return (
        <section>
            <h2>Fruits Collection</h2>
            <button type="button" onClick={addFruit}>Add Banana</button>
            {fruits.length === 0 ? (
                <p>No fruits available</p>
            ) : (
                <ul>
                    {fruits.map((fruit, index) => (
                        <li key={`${fruit}- ${index}`}>
                            {fruit}
                            <button
                                type="button"
                                onClick={() => removeFruit(fruit)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default DisplayFruits;