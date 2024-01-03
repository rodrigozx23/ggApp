import React, { useEffect, useState } from 'react'; // Add this line to import React
import { fetchPedidos } from '../../services/apiService';

function BodyPedidos({
  updatedData,
  setUpdatedData,
  setEditRow,
  openCrearPedidoDetails,
  openUpdPedidoDetails,
  pedidoData, 
  setPedidoData
}) {
  const [loading, setLoading] = useState(true);
	useEffect(() => {
    const fetchData = async () => {
      try {
      const data = await fetchPedidos(); // Assuming fetchProdutos correctly fetches the data
  
      if (Array.isArray(data)) {
        // Check if the response is an array
        setPedidoData(data);
        
        setLoading(false)
      } else {
        console.error('Error: Data received from the API is not an array.');
      }
      } catch (error) {
      console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [setPedidoData]);

  const PedidoButton = ({ cliente, mesa, onClick  }) => {
    return (
      <button style={{ margin: '5px' }} onClick={onClick}>
        Cliente: {cliente} <br /> Mesa# {mesa}        
      </button>
    );
  };

  const activeOrders = pedidoData.filter(order => order.estadoPedido == "1");

  return (
    <div className="row mt-3">
      <div className="col-md-10">      
      </div>
      <div className="col-md-2">
	      <button 
          className="btn btn-primary mt-3" 
          onClick={() => {
              openCrearPedidoDetails()
          }}>
        Add Pedido
        </button>
	    </div>     
      <div className="col-md-12 mt-3">
      <h3>PEDIDOS - MESAS</h3>
      {loading ? (
          <p>Loading...</p>
        ) : (          
          activeOrders.map(order => (
            <PedidoButton key={order.id} cliente={order.cliente} mesa={order.mesa} 
            onClick={() => {
              openUpdPedidoDetails(order.id,order.cliente, order.mesa, order.total)
            }} />
          ))          
        )}
      </div>
    </div>
  );
}

export {BodyPedidos} ;