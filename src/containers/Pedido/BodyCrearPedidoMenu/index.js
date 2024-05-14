import React, { useEffect, useState } from 'react';
import { ProductAutoCompleteInput } from '../../../components/AutoCompleteInput/ProductAutoCompleteInput';
import { fetchProdutos, insertPedido, insertPedidoDetalle} from '../../../services/apiService';

const idToUnitPriceMap = {};

function BodyCrearPedidoMenu({
    mesaInput,
    setMesaInput,
    totalInput,
    setTotalInput,
    openPedidoDetails
}){  
  const [clienteInput, setClienteInput] = useState([]);
  const [descripcionInput, setDescripcionInput] = useState('');
  const [cantidadInput, setCantidadInput] = useState(0);
  const [precioUnitarioInput, setPrecioUnitarioInput] = useState(0);
  const [precioTotalInput, setPrecioTotalInput] = useState(0);
  const [idProductoInput, setIdProducto] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pedidodetalleData, setPedidodetalleData] = useState([]);
  const [productData, setProductData] = useState(null);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [productIds, setProductIds] = useState([]);

  const handleAddToTable = () => {
      // Prepare the data and pass it to the parent component
      if((descripcionInput.length === 0) || 
      (cantidadInput.length === 0)|| (precioTotalInput.length === 0) || 
      (precioUnitarioInput.length === 0)) {
        return;
      } else {
        setLoading(false);
        // Check if there's already an item with the same description
        const existingProductIndex = pedidodetalleData.findIndex(
          item => item.Description === descripcionInput && parseFloat(item.UnitPrice) === parseFloat(precioUnitarioInput)
        );
    
        if (existingProductIndex !== -1) {
          // If item with the same description exists, update its quantity instead of adding a new one
          const updatedPedidodetalleData = [...pedidodetalleData];
          updatedPedidodetalleData[existingProductIndex].Quantity = parseInt(updatedPedidodetalleData[existingProductIndex].Quantity) + parseInt(cantidadInput);
          updatedPedidodetalleData[existingProductIndex].Total = parseFloat(updatedPedidodetalleData[existingProductIndex].UnitPrice) * parseFloat(updatedPedidodetalleData[existingProductIndex].Quantity);
          setPedidodetalleData(updatedPedidodetalleData);
          // Calculate the total sum after the modification
          const totalSum = updatedPedidodetalleData.reduce((sum, row) => sum + row.Total, 0);
          // Set totalInput state with the calculated totalSum
          setTotalInput(totalSum);
        } else {
          // If no item with the same description exists, add a new one
          const newProduct = {
            id: idProductoInput,
            Description: descripcionInput,
            Quantity: parseInt(cantidadInput),
            UnitPrice: parseFloat(precioUnitarioInput),
            Total: parseFloat(cantidadInput) * parseFloat(precioUnitarioInput),
            status_row: true,
          };
          
          setPedidodetalleData(prevData => {
            const newData = [...prevData, newProduct];
            // Calculate the total sum after the modification
            const totalSum = newData.reduce((sum, row) => sum + row.Total, 0);
            // Set totalInput state with the calculated totalSum
            setTotalInput(totalSum);
            return newData;
          });
        }
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProdutos(); // Assuming fetchProdutos correctly fetches the data
        if (Array.isArray(data)) {
          const modifiedData = data.filter(item => item.id_categoria === 14)
          .map(item => ({ id: item.id, description: item.descripcion, unitprice: item.precio, idCategoria: item.id_categoria }));
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
          //setPrecioUnitarioInput(unitPrices);
          setTotalInput(0);
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
      setPrecioUnitarioInput(selectedUnitPrice);
      setDescripcionInput(description);
    } else {
      console.error('Unit price not found for selected product id.');
    }
  };

  const handleInsert = async (totalInput, model) => {
    try {
      const confirmMessage = "Are you sure you want to save this pedido?";
      // Call the insertCategory function to send the POST request
      if (window.confirm(confirmMessage)) {
        const response = await insertPedido({ 
          pedido_id: "0",
          updatedMesa: 1,
          updatedCliente: "Menú",
          updatedTotal: totalInput,
          updatedEstadoPedido: "2" //ESTADO PAGADO
        });
  
        // Check if the response is successful and handle it as needed
        if (response) {
          // Optionally, you can add code to update your UI or take other actions upon success
          const responsePD = await insertPedidoDetalle({ pedido_id: response.id, model: model})
        } else {
          // Handle the case when the request was not successful (e.g., display an error message)
          console.error('Pedido not saved: An error occurred');
        }
      }
      openPedidoDetails();
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }  
  };
  

  return(
	  <div className="container content">
        <div className="col-md-10">
          <h2>Crear Menu</h2>
        </div>
        <div className="row mt-3">
          <div className="form-group">
            <div className="row">
              <div className="col-md-2"> 
                <p>Ingresa Mesa</p>
              </div>
              <div className="col-md-10">
                <input
                type="text"
                className="form-control"
                placeholder="Mesa"
                value='1'
                readOnly = {true}
                />   
              </div>
            </div>
            <div className="row">
              <div className="col-md-2"> 
                <p> Ingresa Cliente</p>
              </div>
              <div className="col-md-10"> 
              <input
                type="text"
                className="form-control"
                placeholder="Cliente"
                value="Menú"
                readOnly = {true}
              />     
              </div>
            </div>           
          </div>
        </div>
        <div className="row">
            <br></br>
            <div className="col-md-10">   
              <h3>Detalle</h3>
            </div>
            <div className="row mt-3">
                <div className="form-group">
                    <div className="row">
                        <div className="col-md-2"> 
                            <p>Ingresa Descripcion</p>
                        </div>
                        <div className="col-md-10">
                            <ProductAutoCompleteInput
                              productDescriptions={productDescriptions} // Provide the product descriptions
                              productIds={productIds} // Provide the product IDs
                              selectedProductDescription={descripcionInput}
                              onProductSelect={handleProductSelect}
                              productData={productData}
                              // Pass any other props you need for the autocomplete component
                              // For example, fetchProducts to fetch product suggestions
                              // and handleProductSelect to handle the selected product
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2"> 
                            <p> Ingresa Cantidad</p>
                        </div>
                        <div className="col-md-10"> 
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Cantidad"
                          value={cantidadInput}
                          onChange={(e) => {
                            const newQuantity = e.target.value;
                            if (/^[1-9]\d*$/.test(newQuantity) || newQuantity === '') {
                              setCantidadInput(newQuantity);
                              // Calculate total price
                              const totalPrice = parseFloat(newQuantity) * parseFloat(precioUnitarioInput);
                              setPrecioTotalInput(totalPrice.toFixed(2)); // Ensure total price is formatted to two decimal place
                            }
                           
                          }}
                        />     
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2"> 
                            <p> Ingresa Precio unitario</p>
                        </div>
                        <div className="col-md-10"> 
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Precio Unitario"
                          value={precioUnitarioInput}
                          onChange={(e) => {
                            const newPrice = e.target.value;
                            if (/^\d*\.?\d*$/.test(newPrice) || newPrice === '') {
                              setPrecioUnitarioInput(newPrice);
                              // Calculate total price
                              const totalPrice = parseFloat(cantidadInput) * parseFloat(newPrice);
                              setPrecioTotalInput(totalPrice.toFixed(2)); // Ensure total price is formatted to two decimal places
                            }                          
                          }}
                        />     
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2"> 
                            <p>Ingresa Precio Total</p>
                        </div>
                        <div className="col-md-10"> 
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Precio Total"
                            value={precioTotalInput}
                            readOnly = {true}
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
        <div className="row mt-3">
          <div className="col-md-12 mt-3">
          {loading ? (
            <p>No Data</p>
            ) : pedidodetalleData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                      <th>#</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>UnitPrice</th>
                      <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                  {pedidodetalleData.map((row, rowIndex) => {
                    return (
                      <tr key={rowIndex}>
                      <td>
                        {
                          row.id
                        }
                      </td>
                      <td>
                        {                    
                          row.Description
                        }
                      </td>	
                      <td>
                        {                      
                          row.Quantity
                        }
                      </td>	
                      <td>
                        {                                             
                         row.UnitPrice
                        }
                      </td>
                      <td>
                        {                     
                          row.Total          
                        }
                      </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No pedido data available.</p>
          )}
          </div>
        </div>      
        <div className="row">
          <div className="col-md-10"></div>
          <div className="col-md-2">
            <input
                type="text"
                className="form-control"
                placeholder="Total"
                value={totalInput ? totalInput.toFixed(2) : totalInput}
                readOnly
            />
          </div>
          <div className="row mt-3">
            <div className="col-md-10"></div>
            <div className="col-md-1">
              <button
                className="btn btn-primary mt-3" // Add margin top class
                onClick={() => handleInsert(totalInput, pedidodetalleData)}
              >
                Cerrar Pedido
              </button>
            </div>
            <div className="col-md-1">
              <button
                className="btn btn-danger mt-3" // Add margin top class
                onClick={() => {
                  openPedidoDetails()
                }}
              >
                Return
              </button>
            </div>
          </div>
        </div>
      
      </div>      
	)
}

export { BodyCrearPedidoMenu };