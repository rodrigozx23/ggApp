import React, { useEffect, useState } from 'react';
import { fetchPedidos } from '../../services/apiService';
import { DateRangePicker } from '../DateRangePicker';

function BodyReportesPedidos({
  openReportePedidos,
  openUpdPedidoDetails,
  pedidos,
  setPedidos,
  openReportePedidosDetalle
}) {
  const [pedidoReporteData, setPedidoReporteData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

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
              minute: '2-digit', timeZone: 'UTC', // Set the time zone to UTC
            });

            return {
              id: item.id,
              cliente: item.cliente,
              mesa: item.mesa,
              estadoPedido: item.estado_pedido, // 0, 1, 2
              descripcionEstadoPedido: (item.estado_pedido == 1) ? "Activo" : ((item.estado_pedido == 2) ? "Vendido" : "Cancelado"),
              fecha: formattedDate,
              hora: formattedTime,
              total: item.total,
              fecha_creacion: item.fecha_creacion
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

  /*const handleSearch = (event, key) => {
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

  const handleSearchDate = (start, end) => {
    // Your logic for filtering data based on the selected date range
    const filtered = pedidoReporteData.filter(item => {
      const itemDate = new Date(item.fecha_creacion);
      return (
        (!start || itemDate >= start) &&
        (!end || itemDate <= end)
      );
    });
    setFilteredData(filtered);
  };*/

  useEffect(() => {
    filterData();
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchValue, searchKey, dateRange, pedidoReporteData]);

  const handleSearch = (event, key) => {
    setSearchValue(event.target.value.toLowerCase());
    setSearchKey(key);
  };

  const handleSearchDate = (start, end) => {
    setDateRange({ start, end });
  };

  const filterData = () => {
    let filtered = pedidoReporteData;

    if (searchValue) {
      filtered = filtered.filter(item => {
        if (searchKey === 'total') {
          return parseFloat(item[searchKey]).toString().toLowerCase().includes(searchValue);
        } else {
          return item[searchKey].toString().toLowerCase().includes(searchValue);
        }
      });
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.fecha_creacion);
        return (
          (!dateRange.start || itemDate >= dateRange.start) &&
          (!dateRange.end || itemDate <= dateRange.end)
        );
      });
    }

    setFilteredData(filtered);
  };

  const totalSum = filteredData.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const orderCount = filteredData.length;
  const [showButton, setShowButton] = useState(false);

  // Función para desplazarse hacia la parte superior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Desplazamiento suave
    });
  };

  return (
    <div>
      <br />
      <div className="col-md-12">
        <button
          className={pedidos ? "btn-pedrep btn-ped" : "btn-pedrep btn-rped"}
          onClick={() => {
            openReportePedidos();
            setPedidos(true);
          }}>
          Reporte Pedidos
        </button>
        <button
          className={pedidos ? "btn-pedrep btn-rep" : "btn-pedrep btn-rrep"}
          onClick={() => {
            openReportePedidosDetalle();
            setPedidos(false);
          }}>
          Reporte Productos
        </button>
      </div>
      <div className="col-md-4">
        <br />
        <br />
        <br />
        <h1><b>Reporte Pedidos</b></h1>
        <br />
      </div>
      <div className="col-md-12 mt-3">
          <p><b>Total Pedidos:</b> {orderCount}</p>
          <p><b>Suma Total:</b> {totalSum.toFixed(2)} soles</p> {/* Format the totalSum to 2 decimal places */}
      </div>
      <div className="col-md-12 mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : pedidoReporteData.length > 0 ? (
          <div>
            <div className="row mb-3">
              <div className="col-md-2">
                <div className="input-group inputGG">
                  <input type="text" className="form-control" placeholder="Filtrar por cliente" onChange={e => handleSearch(e, 'cliente')} />
                </div>
              </div>
              <div className="col-md-2">
                <div className="input-group inputGG">
                  <input type="text" className="form-control" placeholder="Filtrar por total" onChange={e => handleSearch(e, 'total')} />
                </div>
              </div>
              <div className="col-md-2">
                <div className="input-group inputGG">
                  <DateRangePicker handleSearchDate={handleSearchDate} />
                </div>
              </div>
              <div className="col-md-2">
                <div className="input-group inputGG">
                  <input type="text" className="form-control" placeholder="Filtrar por estado" onChange={e => handleSearch(e, 'descripcionEstadoPedido')} />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table id="tbReportePedido" className="table table-striped table-bordered tableReporte">
                <thead>
                  <tr>
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
      <div style={{ height: '100px' }}></div>    
      {showButton && (
            <button
              onClick={scrollToTop}
              style={{
                position: 'fixed',
                bottom: '50px',
                right: '50px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Go to the Top
            </button>
      )}
    </div>
  );
}

export { BodyReportesPedidos };