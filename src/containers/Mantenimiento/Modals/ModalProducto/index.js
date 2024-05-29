import React, { useEffect, useState } from 'react';
import { insertProduct, fetchCategories } from '../../../../services/apiService';
import { CategoryAutoCompleteInput } from '../../../../components/AutoCompleteInput/CategoryAutoCompleteInput';

function ModalProducto({
  descripcionInput,
  setDescripcionInput,
  quantityInput,
  setQuantityInput,
  unitPriceInput,
  setUnitPriceInput,
  categoryInput,
  setCategoryInput,
  setShowModalProductos,
  setProductData,
  setFilteredProductData
}
) {

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [selectedCategoryDescription, setSelectedCategoryDescription] = useState(''); // Added state
  const [categoryId, setCategoryId] = useState([]);

  const handleInsert = async (descripcionInput, quantityInput, unitPriceInput, categoryInput) => {
    try {
      // Call the insertCategory function to send the POST request
      const response = await insertProduct({
        product_id: "0",
        updatedDescription: descripcionInput,
        updatedQuantity: quantityInput,
        updatedUnitPrice: unitPriceInput,
        updatedCategory: categoryInput,
      });

      // Check if the response is successful and handle it as needed
      if (response) {
        // Optionally, you can add code to update your UI or take other actions upon success
        const transformedObject = {
          id: response.id,
          description: response.descripcion,
          quantity: response.stock,
          unitprice: response.precio,
          category: response.descripcion_cat
        };

        setProductData((prevData) => [...prevData, transformedObject]);
        setFilteredProductData((prevData) => [...prevData, transformedObject]);
        // Clear the input and close the modal
        setDescripcionInput('');
        setQuantityInput('');
        setUnitPriceInput('');
        setCategoryInput('');
        setShowModalProductos(false);
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Category not saved: An error occurred');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }
  };

  const [categoryDescriptions, setCategoryDescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories(); // Assuming fetchCategories correctly fetches the data

        if (Array.isArray(data)) {
          // Extract category descriptions from the response and set them in state
          const modifiedData = data.map(item => ({ id: item.id, description: item.descripcion }));
          const descriptions = modifiedData.map(item => item.description);
          const ids = modifiedData.map((item) => item.id);
          setCategoryDescriptions(descriptions);
          setCategoryIds(ids);
        } else {
          console.error('Error: Data received from the API is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCategorySelect = (description, id) => {
    setSelectedCategoryDescription(description);
    setCategoryInput(description); // Update the category input with the selected description
    setCategoryId(id);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="row">
            <div className="col-md-12">
              <h2>Crear Producto</h2>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="row mt-3">
              <div className="form-group">
                <div className="row">
                  <div className="col-md-2">
                    <p>Ingresa producto:</p>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Descripcion"
                      value={descripcionInput}
                      onChange={(e) => setDescripcionInput(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-2">
                    <p>Ingresa cantidad:</p>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Quantity"
                      value={quantityInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                          setQuantityInput(inputValue)
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-2">
                    <p>Ingresa precio unitario:</p>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="UnitPrice"
                      value={unitPriceInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                          setUnitPriceInput(inputValue)
                        }

                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-2">
                    <p>Ingresa categoria:</p>
                  </div>
                  <div className="col-md-10">
                    <CategoryAutoCompleteInput
                      categoryDescriptions={categoryDescriptions}
                      categoryIds={categoryIds}
                      selectedCategoryDescription={categoryInput}
                      onCategorySelect={handleCategorySelect}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-success mt-3" // Add margin top class               
            onClick={() => handleInsert(descripcionInput, quantityInput, unitPriceInput, categoryId)}
          >
            Save
          </button>
          <button
            className="btn btn-danger mt-3" // Add margin top class
            onClick={() => {
              setDescripcionInput('');
              setQuantityInput('');
              setUnitPriceInput('');
              setCategoryInput('');
              setCategoryId('');
              setShowModalProductos(false)
            }
            }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

}


export { ModalProducto };