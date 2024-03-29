import React, { useState, useEffect , useRef } from 'react';

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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(selectedProductDescription);
  }, [selectedProductDescription]);

  useEffect(() => {
    if (suggestionsList.length > 0) {
      setHighlightedIndex(0); // Set the first suggestion as default highlighted
    }
  }, [suggestionsList]);

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
    setHighlightedIndex(-1);
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

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : suggestionsList.length - 1
      );
      scrollHighlightedIntoView();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(prevIndex =>
        prevIndex < suggestionsList.length - 1 ? prevIndex + 1 : 0
      );
      scrollHighlightedIntoView();
    } else if (event.key === 'Enter' && highlightedIndex !== -1) {
      const suggestion = suggestionsList[highlightedIndex];
      const productId = productIds[highlightedIndex];
      onSuggestionSelected(suggestion, productId);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    scrollHighlightedIntoView();
  }, [highlightedIndex]);

  const scrollHighlightedIntoView = () => {
    if (suggestionsContainerRef.current && highlightedIndex !== -1) {
      suggestionsContainerRef.current.children[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleSuggestionKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      const suggestion = suggestionsList[index];
      const productId = productIds[index];
      onSuggestionSelected(suggestion, productId);
    }
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
            onKeyDown={handleKeyDown}
            ref={inputRef}
        />
        <div className="suggestions-container" ref={suggestionsContainerRef}>
            {            
            suggestionsList && suggestionsList.length > 0 ? (
              
                suggestionsList.map((suggestion, index) => (

                <div
                    key={index}
                    className={highlightedIndex === index ? "suggestion highlighted" : "suggestion"}
                    onClick={() => onSuggestionSelected(suggestion, productIds[index])}
                    onKeyDown={(event) => handleSuggestionKeyDown(event, index)}
                    tabIndex="0" // Make the suggestion focusable
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