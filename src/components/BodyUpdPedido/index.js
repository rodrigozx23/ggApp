import React, { useEffect, useState } from 'react';
import { getPedidoDetalles, updatePedido, updatePedidoDetalle, updatePagarPedido  } from '../../services/apiService';
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
    //const [showPedidoDetalleDetails, setShowPedidoDetalleDetails] = useState(false);
    //const [showModalPedidoDetalle, setShowModalPedidoDetalle] = useState(false);
    //const [pedidoDetalleDetails, setPedidoDetalleDetails] = useState([]);
//const [clienteInput, setClienteInput] = useState([]);  
const [loading, setLoading] = useState(true); 

const handleUpdate = async (mesaInput,clienteInput, totalInput, model) => {
  try {
    console.log('Pedido detalle:', model); 
    const confirmMessage = "Are you sure you want to update this pedido?";
    // Call the insertCategory function to send the POST request
    if (window.confirm(confirmMessage)) {
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
        console.log('Pedido updated successfully:', response);        
        const responsePD = await updatePedidoDetalle({ pedido_id: idPedido, model: model})
        console.log('Pedido DET updated successfully:', responsePD);
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Category not saved: An error occurred');
      }
    }
    openPedidoDetails();
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);
  }  
};

const handlePagarPedido = async () => {
  console.log('Pedido pagar:', idPedido); 
  try {
    const confirmMessage = "Are you sure you want to paid this pedido?";
    // Call the insertCategory function to send the POST request
    if (window.confirm(confirmMessage)) {
      const response = await updatePagarPedido(idPedido);

      // Check if the response is successful and handle it as needed
      if (response) {
        // Optionally, you can add code to update your UI or take other actions upon success
        console.log('Pedido updated successfully:', response);        
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Category not saved: An error occurred');
      }
    }
    openPedidoDetails();
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);
  }  
};

useEffect(() => {
	const fetchData = async () => {
	  try {
		const data = await getPedidoDetalles(idPedido); // Assuming fetchProdutos correctly fetches the data

		if (Array.isArray(data)) {
		  // Check if the response is an array
		  setDetallePedidoData(data);
		  
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
        <div className="col-md-10">      
            <h2>Actualizar Pedido</h2>
        </div>
        <div className="col-md-2">
          <button 
            className="btn btn-secondary mt-3" 
            onClick={() => {
                handlePagarPedido()
            }}>
            Pagar Pedido
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
              data ={detallePedidoData} 
              setData = {setDetallePedidoData} 
              type={'update'} 
              editRow={editRow} 
              setEditRow={setEditRow}
              totalInput = {totalInput}
              setTotalInput = {setTotalInput}
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
              >
                Update
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

export { BodyUpdPedido };