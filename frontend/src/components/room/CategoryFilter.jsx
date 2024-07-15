import { useState } from "react";

const CategoryFilter = ({ categories, onCategoryChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryToggle = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelectedCategories);
    onCategoryChange(newSelectedCategories);
  };

  return (
    <div className="category-filter">
      {categories.map((category) => (
        <label key={category} className="category-label">
          <input
            type="checkbox"
            value={category}
            onChange={() => handleCategoryToggle(category)}
            checked={selectedCategories.includes(category)}
          />
          {category}
        </label>
      ))}
    </div>
  );
};

export default CategoryFilter;
