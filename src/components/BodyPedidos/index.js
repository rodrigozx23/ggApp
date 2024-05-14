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
        const modifiedData = data.map(item => {
          // Parse the fecha_creacion string into a Date object
          const fechaCreacionDate = new Date(item.fecha_creacion);

          // Format day and month as "dd/mm"
          const formattedDate = fechaCreacionDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',timeZone: 'UTC', // Set the time zone to UTC
          });

          const formattedTime = fechaCreacionDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',timeZone: 'UTC', // Set the time zone to UTC
          });

          return {
            id: item.id,
            cliente: item.cliente,
            mesa: item.mesa,
            estadoPedido: item.estado_pedido,
            fecha: formattedDate,
            hora: formattedTime,
            total: item.total,
            fecha_creacion : item.fecha_creacion
          };
        });
        setPedidoData(modifiedData);        
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

  const PedidoButton = ({ cliente, mesa, fecha, hora, total, onClick  }) => {
    return (
      <button className='ordersButton' onClick={onClick}>
         <p><span className='left'>{fecha}</span> <span className='right'>Total: {total} soles</span></p>
         <br />
         <p style={{ margin: '0px' }}>Cliente: {cliente}
         <br />
         Mesa: {mesa}</p>
         <br />
         <p className='ordersButBotton'><span className='left'><b>Salon/Delivery</b></span><span className='right'>{ hora }</span></p>
      </button>
    );
  };

  const activeOrders = pedidoData.filter(order => order.estadoPedido == "1");

  return (
    <div className="row mt-3 content">
      <div className="col-md-12">    
	      <button 
          className="btn btn-primary mt-3" 
          onClick={() => {
              openCrearPedidoDetails()
          }}>
        Pedidos
        </button>      
	      <button 
          className="btn btn-primary mt-3" 
          onClick={() => {
              openCrearPedidoDetails()
          }}>
        Reporte
        </button> 
      </div>
      <div className="col-md-12 mt-3">
      <h3>Pedidos Activos</h3>
      </div>
      <div className="col-md-12 mt-3">
      {loading ? (
          <p>Loading...</p>
        ) : (          
          activeOrders.map(order => (
            <PedidoButton key={order.id} cliente={order.cliente} mesa={order.mesa} fecha={order.fecha} hora = {order.hora} total = {order.total}
            onClick={() => {
              openUpdPedidoDetails(order.id, order.cliente, order.mesa, order.total)
            }} />
          ))          
        )}
      </div>
    </div>
  );
}

export {BodyPedidos} ;