import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchPedidos } from '../../services/apiService';

function BodyReportesPedidos()
{
    const [pedidoReporteData, setPedidoReporteData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

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
                month: '2-digit',
                year: 'numeric',
                timeZone: 'UTC', // Set the time zone to UTC
              });
    
              const formattedTime = fechaCreacionDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',timeZone: 'UTC', // Set the time zone to UTC
              });
    
              return {
                id: item.id,
                cliente: item.cliente,
                mesa: item.mesa,
                estadoPedido: item.estado_pedido, // 0, 1, 2
                descripcionEstadoPedido: (item.estado_pedido == 0) ? "Abierto" : ((item.estado_pedido == 2) ? "Vendido" : "Cancelado"),
                fecha: formattedDate,
                hora: formattedTime,
                total: item.total,
                fecha_creacion : item.fecha_creacion
              };
            });

            modifiedData.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

            setPedidoReporteData(modifiedData);
            setFilteredData(modifiedData);
            setLoading(false)
          } else {
            console.error('Error: Data received from the API is not an array.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, []);
      
    const handleSearch = (event, key) => {
      const searchValue = event.target.value.toLowerCase();
      const filtered = pedidoReporteData.filter(item => {
        if (key === 'total') {
          // For 'total', parse the search value as a float and compare it with the item's 'total'
          return parseFloat(item[key]).toString().toLowerCase().includes(searchValue);
        } else {
          // For other keys, directly compare after converting both the item's value and search value to lowercase
          return item[key].toString().toLowerCase().includes(searchValue);
        }
      });
      setFilteredData(filtered);
    };

    const handleSearchDate = (date) => {
      setSelectedDate(date);
      const filtered = pedidoReporteData.filter(item => {
        const itemDate = new Date(item.fecha_creacion);
        return (
          date === null || 
          (itemDate.getFullYear() === date.getFullYear() && 
          itemDate.getMonth() === date.getMonth() && 
          itemDate.getDate() === date.getDate())
        );
      });
      setFilteredData(filtered);
    };

return (
  <div className="row mt-3">
	  <div className="col-md-10">
	  	<h2>Reporte</h2>
	  </div>
	  <div className="col-md-2">
	  </div>
    <div className="col-md-12 mt-3">
      {loading ? (
        <p>Loading...</p>
      ): pedidoReporteData.length > 0 ? (
        <div>
          <div className="mb-3">
              <input type="text" placeholder="Search by Cliente" onChange={e => handleSearch(e, 'cliente')} />
              <input type="text" placeholder="Search by Total" onChange={e => handleSearch(e, 'total')} />
               <DatePicker 
                selected={selectedDate}
                onChange={date => handleSearchDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Search by Fecha"
                isClearable
              />
              <input type="text" placeholder="Search by Estado" onChange={e => handleSearch(e, 'descripcionEstadoPedido')} />
            </div>
            <div className="table-responsive">
              <table id="tbReportePedido" className="table table-striped table-bordered">
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Fecha</th>
                    <th>Hora</th> 
                    <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                {filteredData.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                    <td>{row.id}</td>
                    <td>
                      {                    
                        row.cliente					
                      }
                    </td>	
                    <td>
                      {                    
                        row.total					
                      }
                    </td>	
                    <td>
                      {                    
                        row.fecha					
                      }
                    </td>
                    <td>
                      {                    
                        row.hora					
                      }
                    </td>
                    <td>
                      {                    
                        row.descripcionEstadoPedido					
                      }
                    </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div> 
        </div>
      ) : (
        <p>No Reporte data available.</p>
      )} 
    </div>
    </div>
  );
}

export { BodyReportesPedidos } ;