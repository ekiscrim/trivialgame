import { useState } from "react";

export default function MultiSelectDropdown({ formFieldName, options, onChange }) {

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (e) => {
    const isChecked = e.target.checked;
    const optionId = e.target.value;
    const optionTitle = e.target.name;
    const selectedOption = { _id: optionId, title: optionTitle };
  
    let updatedOptions = [];
  
    if (isChecked) {
      updatedOptions = [...selectedOptions, selectedOption];
    } else {
      updatedOptions = selectedOptions.filter((option) => option._id !== optionId);
    }
  
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
  };


    return (
        <>
        <label className="relative z-0">
        {"Categorias"}
        <input type="checkbox" className=" peer input select select-bordered w-full max-w-x" />
          
  
        <div className="-z-10  bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto">
          <ul>
            {options.map((option, i) => {
              return (
                <li key={i}>
                  <label className="-z-10 flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                    <input
                      type="checkbox"
                      name={option["_id"]}
                      value={option["_id"]}
                      className="z-10 cursor-pointer"
                      onChange={(e) => handleChange(e)}
                    />
                    <span className="z-10 ml-1">{option["title"]}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </label>
      </>
    );
  }