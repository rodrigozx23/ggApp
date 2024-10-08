import React, { useEffect, useState } from 'react';
import { ProductAutoCompleteInput } from '../../../components/AutoCompleteInput/ProductAutoCompleteInput';
import { getPedidoDetalles, updatePedido, updatePedidoDetalle, updatePagarPedido, updateCancelarPedido, fetchProdutos } from '../../../services/apiService';
import { TablaDetallePedido } from '../../../components/TablaDetallePedido';

const idToUnitPriceMap = {};

function ModalPedidoUpd({
  editRow,
  setEditRow,
  mesaInput,
  setMesaInput,
  totalInput,
  setTotalInput,
  clienteInput,
  setClienteInput,
  idPedido,
  setIdPedido,
  openModal,
  setPedidoData,
  modalType,
  openPedidoDetails,
  detallePedidoData,
  setDetallePedidoData
}) {

  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [descripcionInput, setDescripcionInput] = useState('');
  const [cantidadInput, setCantidadInput] = useState('');
  const [precioUnitarioInput, setPrecioUnitarioInput] = useState(0);
  const [precioTotalInput, setPrecioTotalInput] = useState(0);
  const [idProductoInput, setIdProducto] = useState(0);
  const [productData, setProductData] = useState(null);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleAddToTable = () => {
    // Prepare the data and pass it to the parent component
    if ((descripcionInput.length === 0) ||
      (cantidadInput.length === 0) || (precioTotalInput.length === 0) ||
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
        updatedPedidodetalleData[existingProductIndex].status_row = true;
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
          new_row: true,
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
      setUnsavedChanges(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPedidoDetalles(idPedido); // Assuming fetchProdutos correctly fetches the data
        if (Array.isArray(data)) {
          // Check if the response is an array
          const transformedData = data.map(item => ({
            id: item.id,
            Description: item.descripcion, // Replace this with the actual property name for description
            Quantity: item.cantidad,
            UnitPrice: item.precio_unitario,
            Total: item.precio_total,
            status_row: false,
          }));

          setDetallePedidoData(transformedData);

          setLoading(false)
        } else {
          console.error('Error: Data received from the API is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchDataProducto = async () => {
      try {
        const data = await fetchProdutos(); // Assuming fetchProdutos correctly fetches the data
        if (Array.isArray(data)) {
          const modifiedData = data.filter(item => item.id_categoria !== 0)
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
        } else {
          console.error('Error: Data received from the API is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    fetchDataProducto();
  }, [setDetallePedidoData]);

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

  const handleUpdate = async (mesaInput, clienteInput, totalInput, model) => {
    try {
      setButtonDisabled(true);
      const response = await updatePedido({
        pedido_id: idPedido,
        updatedCliente: clienteInput,
        updatedMesa: mesaInput,
        updatedTotal: totalInput,
        updatedEstadoPedido: "1" //ESTADO CREADO
      });

      // Check if the response is successful and handle it as needed
      if (response) {
        // Optionally, you can add code to update your UI or take other actions upon success
        const responsePD = await updatePedidoDetalle({ pedido_id: idPedido, model: model });
        setUnsavedChanges(false);
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Pedido not saved: An error occurred');
      }
      openPedidoDetails();
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setButtonDisabled(false);
    }
  };

  const handlePagarPedido = async (mesaInput, clienteInput, totalInput) => {
    try {
      setButtonDisabled(true);
      //const confirmMessage = "Are you sure you want to paid this pedido?";
      // Call the insertCategory function to send the POST request
      //if (window.confirm(confirmMessage)) {
      const response = await updatePagarPedido({
        pedido_id: idPedido,
        updatedMesa: mesaInput,
        updatedCliente: clienteInput,
        updatedTotal: totalInput
      });

      // Check if the response is successful and handle it as needed
      if (response) {
        // Optionally, you can add code to update your UI or take other actions upon success
        //alert("Pedido Pagado.");          
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Pedido not saved: An error occurred');
      }
      //}
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setButtonDisabled(false);
      openPedidoDetails();
    }
  };

  const handleCancelarPedido = async (mesaInput, clienteInput, totalInput) => {
    try {
      setButtonDisabled(true);
      //const confirmMessage = "Are you sure you want to cancel this pedido?";
      // Call the insertCategory function to send the POST request
      //if (window.confirm(confirmMessage)) {
      const response = await updateCancelarPedido({
        pedido_id: idPedido,
        updatedMesa: mesaInput,
        updatedCliente: clienteInput,
        updatedTotal: totalInput
      });

      // Check if the response is successful and handle it as needed
      if (response) {
        // Optionally, you can add code to update your UI or take other actions upon success   
        //alert("Pedido Cancelado.");    
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Pedido not saved: An error occurred');
      }
      //}
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setButtonDisabled(false);
      openPedidoDetails();
    }
  };

  const handleVolverClick = () => {
    if (unsavedChanges) {
      if (window.confirm("You have unsaved changes. Do you want to save them before leaving?")) {
        handleUpdate(mesaInput, clienteInput, totalInput, detallePedidoData);
      } else {
        return;
      }
    } else {
      openPedidoDetails();
      setEditRow(false);
    }
  };
  
  return (
    <div className='modal'>
      <div className="modal-content">
        <div className='modal-head'>
          <div className='row mt-3'>
            <div className="col-md-1">
            </div>
            <div className="col-md-4 textLeft">
              <h4><b>Actualizar Pedido</b></h4>
            </div>
            <div className="col-md-4">
            </div>
            <div className="col-md-3">
              <img className='' src={require("../../../images/ic-leftarrow.png")} />
              <button
                className="btn-volver" // Add margin top class
                onClick={handleVolverClick}>Volver
              </button>
            </div>
            <div className="col-md-1">
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <br />
            <div className="row">
              <div className="col-md-1">
              </div>
              <div className="col-md-6">
                <div className="col-md-2">
                </div>
                <div className="col-md-10">
                  <div className="placeholder-group">
                    <input type="text" id="mesa" className="placeholder-control form-control" required value={mesaInput} onChange={(e) => setMesaInput(e.target.value)} readOnly></input>
                    <label htmlFor="mesa" className="floating-label">Mesa</label>
                  </div>
                </div>
                <br />
                <div className="col-md-2">
                </div>
                <div className="col-md-10">
                  <div className="placeholder-group">
                    <input type="text" id="cliente" className="placeholder-control form-control" required value={clienteInput} onChange={(e) => setClienteInput(e.target.value)} readOnly></input>
                    <label htmlFor="cliente" className="floating-label">Cliente</label>
                  </div>
                </div>
              </div>
              <div className="col-md-1">
              </div>
              <div className="col-md-3">
                <div className="col-md-12">
                  <button
                    className="btn-pagar btn-modal"
                    onClick={() => {
                      handlePagarPedido(mesaInput, clienteInput, totalInput)
                    }} disabled={buttonDisabled}>
                    <img className='icModal' src={require("../../../images/ic-money.png")} />
                    Pagar Pedido
                  </button>
                </div>
                <div className="col-md-1">
                </div>
                <br />
                <div className="col-md-12">
                  <button
                    className="btn-cancelar btn-modal "
                    onClick={() => {
                      handleCancelarPedido(mesaInput, clienteInput, totalInput)
                    }} disabled={buttonDisabled}>
                    <img className='' src={require("../../../images/ic-cancel-white.png")} />
                    Cancelar Pedido
                  </button>
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-1">
              </div>
              <div className="col-md-4 textLeft">
                <h4><b>Detalle</b></h4>
              </div>
              <div className="col-md-7">
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-1">
                  </div>
                  <div className="col-md-6">
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
                </div>
                <br />
                <div className="row">
                  <div className="col-md-1">
                  </div>
                  <div className="col-md-6">
                    <div className="col-md-10">
                      <div className="placeholder-group">
                        <input type="text" id="cantidad" className="placeholder-control form-control" required value={cantidadInput} onChange={(e) => {
                          const newQuantity = e.target.value;
                          if (/^[1-9]\d*$/.test(newQuantity) || newQuantity === '') {
                            setCantidadInput(newQuantity);
                            // Calculate total price
                            const totalPrice = parseFloat(newQuantity) * parseFloat(precioUnitarioInput);
                            setPrecioTotalInput(totalPrice.toFixed(2)); // Ensure total price is formatted to two decimal place
                          }
                        }}></input>
                        <label htmlFor="cantidad" className="floating-label">Cantidad</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-1">
                  </div>
                  <div className="col-md-3">
                    <button className="btn-agregar btn-modal" onClick={handleAddToTable}>
                      <img className='' src={require("../../../images/ic-add.png")} /> Agregar Producto
                    </button>
                  </div>
                  <div className="col-md-1">
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 mt-3">
                {loading ? (
                  <p>No Detalle data available.</p>
                ) : (
                  <TablaDetallePedido
                    id={idPedido}
                    data={detallePedidoData}
                    setData={setDetallePedidoData}
                    type={'update'}
                    editRow={editRow}
                    setEditRow={setEditRow}
                    totalInput={totalInput}
                    setTotalInput={setTotalInput}
                    mesaInput={mesaInput}
                    clienteInput={clienteInput}
                  />
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-8"></div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control txtTotal"
                  placeholder="Total"
                  value={"Total  " + totalInput.toFixed(2)}
                  readOnly />
              </div>
              <div className="col-md-2"></div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <button
                  className="btn-gg btn-modal" // Add margin top class
                  onClick={() => handleUpdate(mesaInput, clienteInput, totalInput, detallePedidoData)}
                  disabled={buttonDisabled}>
                  <img className='' src={require("../../../images/ic-refresh.png")} /> Actualizar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ModalPedidoUpd };