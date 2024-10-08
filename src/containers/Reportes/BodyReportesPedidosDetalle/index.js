import React, { useEffect, useState } from 'react';
import { fetchPedidos, fetchPedidoDetalles } from '../../../services/apiService';
import { DateRangePicker } from '../../../components/DateRangePicker';

function BodyReportesPedidosDetalle({
  openPedidosDetails,
  openReportePedidos,
  pedidos,
  setPedidos,
  openReportePedidosDetalle
}) {
  const [pedidoDetalleReporteData, setPedidoDetalleReporteData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPedidoDetalles(); // Assuming fetchProdutos correctly fetches the data
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
              idPedido: item.id_pedido,
              id: item.id,
              descripcion: (item.descripcion ? item.descripcion : "Producto NN"),
              cantidad: item.cantidad,
              precio_unitario: item.precio_unitario,
              precio_total: item.precio_total,
              descripcionEstadoPedido: (item.estado_pedido == 0 ? "Vendido" : "Otro"),
              fecha: formattedDate,
              hora: formattedTime,
              fecha_creacion: item.fecha_creacion,
              descripcion_cat: (item.descripcion_cat ? item.descripcion_cat : "Cat NN"),
            };
          });

          modifiedData.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

          setPedidoDetalleReporteData(modifiedData);
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
    const filtered = pedidoDetalleReporteData.filter(item => {
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
    const filtered = pedidoDetalleReporteData.filter(item => {
      const itemDate = new Date(item.fecha_creacion);
      return (
        (!start || itemDate >= start) &&
        (!end || itemDate <= end)
      );
    });
    setFilteredData(filtered);
  };
*/
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
}, [searchValue, searchKey, dateRange, pedidoDetalleReporteData]);

const handleSearch = (event, key) => {
  setSearchValue(event.target.value.toLowerCase());
  setSearchKey(key);
};

const handleSearchDate = (start, end) => {
  setDateRange({ start, end });
};

const filterData = () => {
  let filtered = pedidoDetalleReporteData;

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
        <h1><b>Reporte Productos</b></h1>
        <br />
      </div>
      <div className="col-md-12 mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : pedidoDetalleReporteData.length > 0 ? (
          <div>
            <div className="row mb-3">
              <div className="col-md-2">
                <div className="input-group inputGG">
                  <input type="text" className="form-control" placeholder="Filtrar por descripcion" onChange={e => handleSearch(e, 'descripcion')} />
                </div>
              </div>
              <div className="col-md-2">
                <div className="input-group inputGG">
                  <input type="text" className="form-control" placeholder="Filtrar por Total" onChange={e => handleSearch(e, 'total')} />
                </div>
              </div>
              <div className="col-md-2">
                <div className="input-group">
                  <DateRangePicker handleSearchDate={handleSearchDate} />
                </div>
              </div>
              <div className="col-md-2">
                <div className="input-group inputGG">
                  <input type="text" className="form-control" placeholder="Filtrar por Categoria" onChange={e => handleSearch(e, 'descripcion_cat')} />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table id="tbReportePedidoDetalle" className="table table-striped table-bordered tableReporte">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripcion</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                    <th>Hora</th>
                    <th>Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, rowIndex) => {
                    return (
                      <tr key={rowIndex}>
                        <td>
                          {
                            row.fecha
                          }
                        </td>
                        <td>
                          {
                            row.descripcion
                          }
                        </td>
                        <td>
                          {
                            row.cantidad
                          }
                        </td>
                        <td>
                          {
                            row.precio_unitario
                          }
                        </td>
                        <td>
                          {
                            row.precio_total
                          }
                        </td>
                        <td>
                          {
                            row.hora
                          }
                        </td>
                        <td>
                          {
                            row.descripcion_cat
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

export { BodyReportesPedidosDetalle };