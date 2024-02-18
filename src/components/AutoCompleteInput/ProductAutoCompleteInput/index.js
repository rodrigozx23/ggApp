import React, { useState, useEffect } from 'react';

const ProductAutoCompleteInput = ({ 
  productDescriptions, 
  productIds,
  selectedProductDescription,
  onProductSelect,
  productData
}) => {

  const [value, setValue] = useState('');
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    setValue(selectedProductDescription);
  }, [selectedProductDescription]);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();  
    return productDescriptions.filter((description) =>
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

  const onSuggestionSelected = (suggestion, productId) => {
    // Set the selected suggestion in the input field
    const productO = productData.find(item => item.description === suggestion);
    setValue(suggestion);   
    setSelectedProductId(productO.id);
    setSuggestionsList([]); // Close suggestions after selection
    // Call the parent component's callback to select the category
    onProductSelect(suggestion, productO.id)
  };

  return (
    <div className="input-container">
        <input
            type="hidden"
            name="product_id" // You can set a name for the hidden input
            value={selectedProductId}
        />
        <input
            className="custom-input"
            placeholder="Product"
            value={value}
            onChange={onInputChange}
        />
        <div className="suggestions-container">
            {            
            suggestionsList && suggestionsList.length > 0 ? (
              
                suggestionsList.map((suggestion, index) => (

                <div
                    key={index}
                    className="suggestion"
                    onClick={() => onSuggestionSelected(suggestion, productIds[index])}
                >
                    {suggestion}
                </div>
                ))
            ) : null}
        </div>
    </div>
  );
};

export { ProductAutoCompleteInput };