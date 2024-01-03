import React, { useState, useEffect} from 'react';
import { PedidosDetalleForm } from '../../../../components/PedidosDetalleForm';
import { TablaCrearDetallePedido } from '../../../../components/TablaCrearDetallePedido';

function ModalPedidoDetalle({
    setShowModalPedidoDetalle,
    setDetallePedidoData
}) {
  const [tableData, setTableData] = useState([]);
  
  const addToTable = (newProduct) => {
    setTableData([...tableData, newProduct]);
  };

  return (
    <div className="modal">
        <div className="modal-content">
          <div class="modal-header">
            <div className="row">
              <div className="col-md-12"> 
                <h2>Pedido Detalle</h2>
              </div>          
            </div>
          </div>
        <div class="modal-body">
          <div className="row">
            <div className="form-group">
                <PedidosDetalleForm           
                  onAddToTable={addToTable}                
                />
            </div>         
          </div>
          <div className="row mt-3">
            <div>
                <TablaCrearDetallePedido data={tableData}/>
            </div>         
          </div>
        </div>
        <div class="modal-footer">
            <button
                className="btn btn-primary mt-3" // Add margin top class               
                onClick={() => {
                  // Pass the data to the parent component when the "Save" button is clicked
                  setDetallePedidoData(tableData);
                  setShowModalPedidoDetalle(false);
                }}
            >
            Save
            </button>
            <button 
                className="btn btn-secondary   mt-3" 
                onClick={() => {
                  setShowModalPedidoDetalle(false)
                }}
            >
            Close
            </button>
        </div>
        </div>
    </div>    
  );
}

export {ModalPedidoDetalle} ;