import React, { useEffect, useState } from 'react';
import { getPedidoDetalles, updatePedido, updatePedidoDetalle, updatePagarPedido, updateCancelarPedido } from '../../services/apiService';
import { TablaDetallePedido } from '../TablaDetallePedido';

function BodyUpdPedido({
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
}){  
 
const [loading, setLoading] = useState(true);
const [buttonDisabled, setButtonDisabled] = useState(false);

const handleUpdate = async (mesaInput,clienteInput, totalInput, model) => {
  try {
    setButtonDisabled(true);
    //const confirmMessage = "Are you sure you want to update this pedido?";
    // Call the insertCategory function to send the POST request
    //if (window.confirm(confirmMessage)) {
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
      const responsePD = await updatePedidoDetalle({ pedido_id: idPedido, model: model})
    } else {
      // Handle the case when the request was not successful (e.g., display an error message)
      console.error('Pedido not saved: An error occurred');
    }
    //}
    openPedidoDetails();
  } catch (error) {
    console.error('Network error:', error);
  } finally {
    setButtonDisabled(false);
  }
};

const handlePagarPedido = async (mesaInput,clienteInput, totalInput) => {
  try {
    setButtonDisabled(true);
    //const confirmMessage = "Are you sure you want to paid this pedido?";
    // Call the insertCategory function to send the POST request
    //if (window.confirm(confirmMessage)) {
    const response = await updatePagarPedido({
        pedido_id : idPedido, 
        updatedMesa: mesaInput, 
        updatedCliente: clienteInput, 
        updatedTotal: totalInput
      });

    // Check if the response is successful and handle it as needed
    if (response) {
      // Optionally, you can add code to update your UI or take other actions upon success
      alert("Pedido Pagado.");          
    } else {
      // Handle the case when the request was not successful (e.g., display an error message)
      console.error('Pedido not saved: An error occurred');
    }
    //}
    openPedidoDetails();
  } catch (error) {
    console.error('Network error:', error);
  } finally {
    setButtonDisabled(false);
  }
};

const handleCancelarPedido = async (mesaInput,clienteInput, totalInput) => {
  try {
    setButtonDisabled(true);
    //const confirmMessage = "Are you sure you want to cancel this pedido?";
    // Call the insertCategory function to send the POST request
    //if (window.confirm(confirmMessage)) {
    const response = await updateCancelarPedido({
        pedido_id : idPedido, 
        updatedMesa: mesaInput, 
        updatedCliente: clienteInput, 
        updatedTotal: totalInput
      });

    // Check if the response is successful and handle it as needed
    if (response) {
      // Optionally, you can add code to update your UI or take other actions upon success   
      alert("Pedido Cancelado.");    
    } else {
      // Handle the case when the request was not successful (e.g., display an error message)
      console.error('Pedido not saved: An error occurred');
    }
    //}
    openPedidoDetails();
  } catch (error) {
    console.error('Network error:', error);
  } finally {
    setButtonDisabled(false);
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
	fetchData();
	}, [setDetallePedidoData]);

  return(
	  <div className="container">  
      <div className='row'>
        <div className="col-md-8">      
            <h2>Actualizar Pedido</h2>
        </div>
        <div className="col-md-2">
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => {
                handlePagarPedido(mesaInput, clienteInput, totalInput)
            }}
            disabled={buttonDisabled}>
            Pagar Pedido
          </button>
        </div>
        <div className="col-md-2">
          <button 
            className="btn btn-secondary mt-3" 
            onClick={() => {
                handleCancelarPedido(mesaInput, clienteInput, totalInput)
            }}
            disabled={buttonDisabled}>
            Cancelar Pedido
          </button>
        </div> 
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
                value={mesaInput}
                onChange={(e) => setMesaInput(e.target.value)}
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
                value={clienteInput}
                onChange={(e) => setClienteInput(e.target.value)}
                readOnly/>     
              </div>
            </div>           
          </div>
        </div>
        <div className="row justify-content-end">
            <div className="col-md-10 mt-3">   
              <h3>Producto Detalle</h3>
            </div>
            <div className="col-md-2">
              <button
              className="btn btn-success mt-3" // Add margin top class
              onClick={() => openModal(modalType)}
              >
              Agregar Detalle
              </button>
            </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
          {loading ? (
            <p>No Detalle data available.</p>
          ) : (
            <TablaDetallePedido 
              id = {idPedido}
              data ={detallePedidoData} 
              setData = {setDetallePedidoData} 
              type={'update'} 
              editRow={editRow} 
              setEditRow={setEditRow}
              totalInput = {totalInput}
              setTotalInput = {setTotalInput}
              mesaInput = {mesaInput}
              clienteInput = {clienteInput}
            />          
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
                value={totalInput.toFixed(2)}
                readOnly
            />
          </div>
          <div className="row mt-3">
            <div className="col-md-10"></div>
            <div className="col-md-1">
              <button
                className="btn btn-primary mt-3" // Add margin top class
                onClick={() => handleUpdate(mesaInput, clienteInput, totalInput, detallePedidoData)}
                disabled={buttonDisabled}>
                Update
              </button>
            </div>
            <div className="col-md-1">
              <button
                className="btn btn-danger mt-3" // Add margin top class
                onClick={() => {
                  openPedidoDetails();
                  setEditRow(false);
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

export { BodyUpdPedido };