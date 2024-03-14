import React, { useEffect, useState } from 'react';
import { insertPedido, insertPedidoDetalle } from '../../services/apiService';
import { TablaDetallePedido } from '../TablaDetallePedido';

function BodyCrearPedido({
	mesaInput,
	setMesaInput,
	totalInput,
  setTotalInput,
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
const [clienteInput, setClienteInput] = useState([]);  

const handleInsert = async (mesaInput, clienteInput, totalInput, model) => {
  try {
    const confirmMessage = "Are you sure you want to save this pedido?";
    // Call the insertCategory function to send the POST request
    if (window.confirm(confirmMessage)) {
      const response = await insertPedido({ 
        pedido_id: "0",
        updatedMesa: mesaInput,
        updatedCliente: clienteInput,
        updatedTotal: totalInput,
        updatedEstadoPedido: "1" //ESTADO CREADO
      });

      // Check if the response is successful and handle it as needed
      if (response) {
        // Optionally, you can add code to update your UI or take other actions upon success
        const responsePD = await insertPedidoDetalle({ pedido_id: response.id, model: model})
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


  return(
	  <div className="container">
        <div className="col-md-10">
          <h2>Crear Pedido</h2>
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
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Check if the input is a valid decimal number
                  if (/^[1-9]\d*$/.test(inputValue) || inputValue === '') {
                    setMesaInput(inputValue);
                  }
                }}
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
              />     
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
            <TablaDetallePedido data ={detallePedidoData} setData={setDetallePedidoData} />
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
                onClick={() => handleInsert(mesaInput, clienteInput, totalInput, detallePedidoData)}
              >
                Save
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

export { BodyCrearPedido };