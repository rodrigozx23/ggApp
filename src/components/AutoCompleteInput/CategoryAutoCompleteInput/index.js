import React, { useState, useEffect } from 'react';

const CategoryAutoCompleteInput = ({ 
  categoryDescriptions, 
  categoryIds,
  selectedCategoryDescription,
  onCategorySelect
}) => {

  const [value, setValue] = useState('');
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    setValue(selectedCategoryDescription);
  }, [selectedCategoryDescription]);

  const getSuggestions = (inputValue) => {
    console.log(inputValue);
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return categoryDescriptions.filter((description) =>
      description.toLowerCase().includes(inputValueLowerCase)
    );
  };
  const onInputChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    // Update the suggestions list
    const newSuggestions = getSuggestions(inputValue);
    setSuggestionsList(newSuggestions);
  };

  const onSuggestionSelected = (suggestion,categoryId) => {
    // Set the selected suggestion in the input field
    setValue(suggestion);
    setSelectedCategoryId(categoryId);
    setSuggestionsList([]); // Close suggestions after selection

    // Call the parent component's callback to select the category
    onCategorySelect(suggestion, categoryId)
  };

  return (
    <div className="input-container">
        <input
            type="hidden"
            name="category_id" // You can set a name for the hidden input
            value={selectedCategoryId}
        />
        <input
            className="custom-input"
            placeholder="Category"
            value={value}
            onChange={onInputChange}
        />
        <div className="suggestions-container">
            {suggestionsList && suggestionsList.length > 0 ? (
                suggestionsList.map((suggestion, index) => (
                <div
                    key={index}
                    className="suggestion"
                    onClick={() => onSuggestionSelected(suggestion, categoryIds[index])}
                >
                    {suggestion}
                </div>
                ))
            ) : null}
        </div>
    </div>
  );
};

export { CategoryAutoCompleteInput };