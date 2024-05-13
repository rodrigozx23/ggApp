import React, { useState, useEffect } from 'react';
import { ProductAutoCompleteInput } from '../../components/AutoCompleteInput/ProductAutoCompleteInput'; // Assuming you have a similar component for product descriptions
import { fetchProdutos } from '../../services/apiService';

const idToUnitPriceMap = {};

const PedidosDetalleForm = ({ onAddToTable }) => {
  const [productData, setProductData] = useState(null);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [unitPrices, setUnitPrices] = useState([]);
  const [idProductoInput, setIdProducto] = useState('');
  const [descripcionFormInput, setDescripcionFormInput] = useState('');
  const [quantityFormInput, setQuantityFormInput] = useState('');
  const [unitPriceFormInput, setUnitPriceFormInput] = useState('');

  // Fetch products based on the provided characteristics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProdutos(); // Assuming fetchProdutos correctly fetches the data
        if (Array.isArray(data)) {
          const modifiedData = data.filter(item => item.id_categoria !== 14)
          .map(item => ({ id: item.id, description: item.descripcion, unitprice: item.precio }));
          // Extract products descriptions from the response and set them in state
          const descriptions = modifiedData.map(item => item.description);
          const ids = modifiedData.map((item) => item.id);
          const unitPrices = modifiedData.map(item => item.unitprice);
          setProductData(modifiedData);
          for (let i = 0; i < ids.length; i++) {
            idToUnitPriceMap[ids[i]] = unitPrices[i];
          }        
          setProductDescriptions(descriptions);
          setProductIds(ids);
          setUnitPrices(unitPrices);
        } else {
          console.error('Error: Data received from the API is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleProductSelect = (description, id) => {
    const selectedUnitPrice = idToUnitPriceMap[id];
    if (selectedUnitPrice !== undefined) {
      setIdProducto(id);
      setUnitPriceFormInput(selectedUnitPrice);
      setDescripcionFormInput(description);
    } else {
      console.error('Unit price not found for selected product id.');
    }
  };

  const handleAddToTable = () => {
    // Prepare the data and pass it to the parent component
    if((idProductoInput.length === 0) ||
    (descripcionFormInput.length === 0) || 
    (quantityFormInput.length === 0)|| 
    (unitPriceFormInput.length === 0)) {
      return;
    } else{
      const newProduct = {
        idProducto: idProductoInput,
        Description: descripcionFormInput,
        Quantity: quantityFormInput,
        UnitPrice: unitPriceFormInput,
        status_row: true,
      };
      onAddToTable(newProduct);
      setIdProducto('');
      setDescripcionFormInput('');
      setQuantityFormInput('');
      setUnitPriceFormInput('');
    }   
  };

  return (
    <div className="container">
      <div className="row mt-3">
          <div className="form-group">
            <div className="row">
              <div className="col-md-2"> 
                <p>Ingresa producto:</p>
              </div>
              <div className="col-md-10">
                <ProductAutoCompleteInput
                  productDescriptions={productDescriptions} // Provide the product descriptions
                  productIds={productIds} // Provide the product IDs
                  selectedProductDescription={descripcionFormInput}
                  onProductSelect={handleProductSelect}
                  productData={productData}
                  // Pass any other props you need for the autocomplete component
                  // For example, fetchProducts to fetch product suggestions
                  // and handleProductSelect to handle the selected product
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
                  value={quantityFormInput}
                  onChange={
                    (e) => setQuantityFormInput(e.target.value)
                    //(e) => handleProductChange(e, 'quantityFormInput')
                  }
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
                  placeholder="Unit Price"
                  value={unitPriceFormInput}
                  readOnly
                />
              </div>
            </div>       
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-10"></div>
          <div className="col-md-2">
            <button className="btn btn-success" onClick={handleAddToTable}>Add to Table</button>
          </div>
        </div>     
    </div>
  );
};

export { PedidosDetalleForm };
