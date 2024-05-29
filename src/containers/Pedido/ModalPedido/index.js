import React, { useEffect, useState } from 'react';
import { ProductAutoCompleteInput } from '../../../components/AutoCompleteInput/ProductAutoCompleteInput';
import { fetchProdutos, insertPedido, insertPedidoDetalle} from '../../../services/apiService';
import { TablaDetallePedido } from '../../../components/TablaDetallePedido';

const idToUnitPriceMap = {};

function ModalPedido({
    editRow,
    setEditRow,
    mesaInput,
    setMesaInput,
    totalInput,
    setTotalInput,
    openModal,
    setPedidoData,
    modalType,
    openPedidoDetails,
    closeCrearPedido,
    detallePedidoData,
    setDetallePedidoData,
    handleActiveIndex
}){  
  const [clienteInput, setClienteInput] = useState([]);
  const [descripcionInput, setDescripcionInput] = useState('');
  const [cantidadInput, setCantidadInput] = useState(0);
  const [precioUnitarioInput, setPrecioUnitarioInput] = useState(0);
  const [precioTotalInput, setPrecioTotalInput] = useState(0);
  const [idProductoInput, setIdProducto] = useState(0);
  const [loading, setLoading] = useState(true);

  const [productData, setProductData] = useState(null);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [productIds, setProductIds] = useState([]);

  const [serviceType, setServiceType] = useState('Salon');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleAddToTable = () => {
      // Prepare the data and pass it to the parent component
      if((descripcionInput.length === 0) || 
      (cantidadInput.length === 0)|| (precioTotalInput.length === 0) || 
      (precioUnitarioInput.length === 0)) {
        return;
      } else {
        setLoading(false);
        // Check if there's already an item with the same description
        const existingProductIndex = detallePedidoData.findIndex(
          item => item.Description === descripcionInput && parseFloat(item.UnitPrice) === parseFloat(precioUnitarioInput)
        );
    
        if (existingProductIndex !== -1) {
          // If item with the same description exists, update its quantity instead of adding a new one
          const updatedPedidodetalleData = [...detallePedidoData];
          updatedPedidodetalleData[existingProductIndex].Quantity = parseInt(updatedPedidodetalleData[existingProductIndex].Quantity) + parseInt(cantidadInput);
          updatedPedidodetalleData[existingProductIndex].Total = parseFloat(updatedPedidodetalleData[existingProductIndex].UnitPrice) * parseFloat(updatedPedidodetalleData[existingProductIndex].Quantity);
          setDetallePedidoData(updatedPedidodetalleData);
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
          
          setDetallePedidoData(prevData => {
            const newData = [...prevData, newProduct];
            // Calculate the total sum after the modification
            const totalSum = newData.reduce((sum, row) => sum + row.Total, 0);
            // Set totalInput state with the calculated totalSum
            setTotalInput(totalSum);
            return newData;
          });
        }

        setCantidadInput("");
        setDescripcionInput("");
      }
  };

  const handleServiceTypeChange = () => {
    setServiceType(prevType => prevType === 'Salon' ? 'Menu' : 'Salon');
  };

  const populateProducts = async () => {
    try {
      const data = await fetchProdutos(); // Assuming fetchProdutos correctly fetches the data
      if (Array.isArray(data)) {
        const modifiedData = data.filter(item => {
            if (serviceType === 'Menu') {
                return item.id_categoria === 14;
            } else {
                return item.id_categoria !== 14;
            }
          }
        )
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
        setTotalInput(0);
      } else {
        console.error('Error: Data received from the API is not an array.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    populateProducts()
  }, [serviceType]);

  const handleProductSelect = (description, id) => {
    const selectedUnitPrice = idToUnitPriceMap[id];
    if (selectedUnitPrice !== undefined) {
      setIdProducto(id);
      setPrecioUnitarioInput(selectedUnitPrice);
      setDescripcionInput(description);
      setCantidadInput(1);
    } else {
      console.error('Unit price not found for selected product id.');
    }
  };

  const handleInsert = async (clienteInput, mesaInput, totalInput, model) => {
    try {
      //const confirmMessage = "Are you sure you want to save this pedido?";
      // Call the insertCategory function to send the POST request
      //if (window.confirm(confirmMessage)) {
      const response = await insertPedido({ 
        pedido_id: "0",
        updatedMesa: mesaInput,
        updatedCliente: clienteInput,
        updatedTotal: totalInput,
        updatedEstadoPedido: "1"
      });

      // Check if the response is successful and handle it as needed
      if (response) {
        // Optionally, you can add code to update your UI or take other actions upon success
        const responsePD = await insertPedidoDetalle({ pedido_id: response.id, model: model})
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Pedido not saved: An error occurred');
      }
      //}
      openPedidoDetails();
      handleActiveIndex(0);
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }  
  };

  const handlePagarPedido = async (mesaInput, clienteInput, totalInput, model) => {
    console.log(model);
    try {
      setButtonDisabled(true);
      // Call the insertCategory function to send the POST request
      const response = await insertPedido({ 
        pedido_id: "0",
        updatedMesa: mesaInput,
        updatedCliente: clienteInput,
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
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    } finally {
      setButtonDisabled(false);
      openPedidoDetails();
      handleActiveIndex(0);
    }
  };

  return(
    <div className="modal">
        <div className="modal-content">
            <div className='modal-head'>
                <div className='row mt-3'>
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                        <button
                            className="btn btn-danger mt-3" // Add margin top class
                            onClick={() => {
                              closeCrearPedido()
                            }}
                        >
                        ↵ Volver
                        </button>
                    </div>
                </div>
            </div>    
            <div className="modal-body">
                <div className="container">
                    <div className="row">
                        <div className="row col-md-3">
                            <h2>Crear Pedido</h2>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="row col-md-1"></div>
                        <div className="row col-md-11">
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
                                        value={mesaInput}
                                        onChange={(e) => {
                                        const inputValue = e.target.value;
                                        // Check if the input is a valid decimal number
                                        if (/^[1-9]\d*$/.test(inputValue) || inputValue === '') {
                                            setMesaInput(inputValue);
                                        }
                                        }}/>   
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2"> 
                                        <p>Ingresa Cliente</p>
                                    </div>
                                    <div className="col-md-10"> 
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Cliente"
                                        value={clienteInput}
                                        onChange={(e) => setClienteInput(e.target.value)}/>     
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2"> 
                                        <p>Tipo de Servicio</p>
                                    </div>
                                    <div className="col-md-10">
                                      <div className="form-check form-check-inline">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id="menuOption"
                                          checked={serviceType === 'Menu'}
                                          onChange={(e)=> {
                                            handleServiceTypeChange();
                                            setClienteInput(e.target.checked ? 'Menu' : '');
                                          }}
                                        />
                                        <label className="form-check-label" htmlFor="menuOption">
                                          Menu
                                        </label>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="row col-md-2">   
                            <h3>Detalle</h3>
                        </div>
                    </div>
                    <br />
                    <div className="row"> 
                        <div className="row col-md-1"></div>
                        <div className="row col-md-7">
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
                            </div>
                        </div>
                        <div className="col align-self-center">
                            <div className="col-md-12">
                                <button className="btn btn-success" onClick={handleAddToTable}>+ Agregar Producto</button>
                            </div>
                            <br />
                            <div className="col-md-12">
                              <button 
                                  className="btn btn-primary" 
                                  onClick={() => {
                                      handlePagarPedido(mesaInput, clienteInput, totalInput, detallePedidoData)
                                  }}
                                  disabled={buttonDisabled}>
                                  Pagar Pedido
                              </button>
                            </div>
                        </div>    
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12 mt-3">
                            <TablaDetallePedido 
                            editRow={editRow}
                            setEditRow={setEditRow}
                            data ={detallePedidoData}
                            setData={setDetallePedidoData}
                            totalInput = {totalInput}
                            setTotalInput = {setTotalInput}
                            />
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
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                              <button
                                  className="btn btn-primary mt-3" // Add margin top class
                                  onClick={() => handleInsert(clienteInput, mesaInput, totalInput, detallePedidoData)}
                              >
                                  Crear Pedido
                              </button>
                          </div>
                          <div className="col-md-4"></div>
                      </div>
                    </div>
                </div>
            </div>
        </div>      
    </div>
	)
}

export { ModalPedido };