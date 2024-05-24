import React, { useState } from 'react';

const MultiSelectDropdown = ({ formFieldName, options, selectedOptions, onChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedOptionTitles = selectedOptions.map(opt => opt.title).join(', ');

  const handleChange = (e) => {
    const optionId = e.target.value;
    const selected = selectedOptions.find(option => option._id === optionId);

    if (selected) {
      onChange(selectedOptions.filter(option => option._id !== optionId));
    } else {
      const newOption = options.find(option => option._id === optionId);
      onChange([...selectedOptions, newOption]);
    }
  };

  return (
    <>
      <label className="relative z-0 ">
        {"Categorías"}
        <input
          type="text"
          className="peer input select select-bordered w-full"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          value={selectedOptionTitles}
          readOnly
        />
        <div className={`bg-white border transition-opacity duration-300 ease-in-out ${dropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} flex flex-wrap pb-8 w-full`}>
          {options.map((option, i) => (
            <label key={i} className="flex items-center whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100">
              <input
                type="checkbox"
                name={option["_id"]}
                value={option["_id"]}
                className="cursor-pointer mr-1 gap-2"
                onChange={(e) => handleChange(e)}
                checked={selectedOptions.some(opt => opt._id === option._id)}
              />
              <span className="ml-1">{option["title"]}</span>
            </label>
          ))}
        </div>
      </label>
    </>
  );
};

export default MultiSelectDropdown;
