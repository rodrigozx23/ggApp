import React, { useState } from 'react';
import { TableDataProvider } from './context';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { MenuBar } from './components/MenuBar';

import { ModalCategoria } from './containers/Mantenimiento/Modals/ModalCategoria';
import { ModalProducto } from './containers/Mantenimiento/Modals/ModalProducto';

import { BodyMantenimientoProducto } from './components/BodyMantenimientoProducto';
import { BodyMantenimientoCategory } from './components/BodyMantenimientoCategory';

import { BodyPedidos } from './components/BodyPedidos';
import { BodyCrearPedido } from './components/BodyCrearPedido';
import { BodyUpdPedido } from './components/BodyUpdPedido';
import { ModalPedidoDetalle } from './containers/Pedido/Modals/ModalPedidoDetalle';

import { BodyPedidosMenu } from './components/BodyPedidosMenu';
import './App.css';

function App() {
  const [showAlmacenOptions, setShowAlmacenOptions] = useState(false);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [showCategoriaDetails, setShowCategoriaDetails] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);    

  const [showProductosDetails, setShowProductosDetails] = useState(false);  
  const [showModalProductos, setShowModalProductos] = useState(false);

  const [showPedidosMenuDetails, setShowPedidosMenuDetails] = useState(false);
  const [showPedidosDetails, setShowPedidosDetails] = useState(false);
  const [showCrearPedidoDetails, setShowCrearPedidoDetails] = useState(false);
  const [showUpdPedidoDetails, setShowUpdPedidoDetails] = useState(false);
  const [showModalPedidoDetalle, setShowModalPedidoDetalle] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);  
  const [pedidoData, setPedidoData] = useState([]);  
  const [detallePedidoData, setDetallePedidoData] = useState([]); 

  const [categoriaDetails, setCategoriaDetails] = useState([]);  
  const [productosDetails, setProductosDetails] = useState([]);
  const [pedidosDetails, setPedidosDetails] = useState([]);

  const [memoDetails, setMemoDetails] = useState([]);
  const [editRow, setEditRow] = useState(null);  

  const [descripcionInput, setDescripcionInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [unitPriceInput, setUnitPriceInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [mesaInput, setMesaInput] = useState('');
  const [clienteInput, setClienteInput] = useState('');
  const [totalInput, setTotalInput] = useState('');
  const [idPedido, setIdPedido] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');	
  const [updatedData, setUpdatedData] = useState({});
	
	
  const openCategoriaDetails = () => {
    setShowCategoriaDetails(true);
    setShowPedidosMenuDetails(false);
    setShowModalCategoria(false);
    setShowProductosDetails(false);
    setShowPedidosDetails(false);
    setShowCrearPedidoDetails(false);
    setShowUpdPedidoDetails(false);
    setMemoDetails(categoriaDetails);
  };

  const openProductosDetails = () => {
    setShowProductosDetails(true);
    setShowPedidosMenuDetails(false);
    setShowModalProductos(false);
    setShowCategoriaDetails(false);
    setShowPedidosDetails(false);
    setShowCrearPedidoDetails(false);
    setShowUpdPedidoDetails(false);
    setMemoDetails(productosDetails);
  };

  const openPedidosDetails = () => {
    setShowPedidosDetails(true);
    setShowCrearPedidoDetails(false);
    setShowModalPedidoDetalle(false);
    setShowCategoriaDetails(false);
    setShowProductosDetails(false);
    setShowUpdPedidoDetails(false);
    setShowPedidosMenuDetails(false);
    setMemoDetails(pedidosDetails);
  };

  const openPedidosMenuDetails = () => {
    setShowPedidosMenuDetails(true);
    setShowPedidosDetails(false);
    setShowCrearPedidoDetails(false);
    setShowModalPedidoDetalle(false);
    setShowCategoriaDetails(false);
    setShowProductosDetails(false);
    setShowUpdPedidoDetails(false);
    setMemoDetails(pedidosDetails);
  };

  const openModal = (modalType) => {
    if (modalType === 'categoria') {
      setShowModalCategoria(true);
      setShowCategoriaDetails(true);
    } else if (modalType === 'productos') {
      setShowModalProductos(true);
      setShowProductosDetails(true);
    }
    else if (modalType === 'pedidos') {
      setShowPedidosDetails(false);
      setShowModalPedidoDetalle(true);     
      setShowCrearPedidoDetails(true);
    }
    else if (modalType === 'pedidosUpd') {
      setShowPedidosDetails(false);
      setShowModalPedidoDetalle(true);     
      setShowUpdPedidoDetails(true);
    }
  };

  const openCrearPedidoDetails = () => {
    setShowCrearPedidoDetails(true);
    setShowUpdPedidoDetails(false)
    setShowModalPedidoDetalle(false);
    setShowPedidosDetails(false);
    setShowCategoriaDetails(false);
    setShowProductosDetails(false);
    setShowPedidosMenuDetails(false);
    setMesaInput('');
    setTotalInput('');
    setDetallePedidoData([]);
  }

  const openUpdPedidoDetails = (iorder, iCliente, imesa, itotal) => {
    setShowUpdPedidoDetails(true);
    setShowCrearPedidoDetails(false);
    setShowModalPedidoDetalle(false);
    setShowPedidosDetails(false);
    setShowCategoriaDetails(false);
    setShowProductosDetails(false);    
    setShowPedidosMenuDetails(false);
    setIdPedido(iorder);
    setMesaInput(imesa);
    setTotalInput(itotal);
    setClienteInput(iCliente);
    //setDetallePedidoData([]);
  }

  const openPedidoDetails =() => {
    setShowCrearPedidoDetails(false);
    setShowUpdPedidoDetails(false);
    setShowModalPedidoDetalle(false);
    setShowPedidosDetails(true);
    setShowPedidosMenuDetails(false);
    setShowCategoriaDetails(false);
    setShowProductosDetails(false);
  }

  const saveDetallePedidoData = (data) => {
    // Update the state with the data passed from the ModalPedidoDetalle
    const updatedDetallePedidoData = [...detallePedidoData]; // Create a copy of the existing data

    // Loop through the new data and add/update quantities based on the description

    let totalOfTotals = 0;

    data.forEach((newItem) => {
      const existingItemIndex = updatedDetallePedidoData.findIndex(
        (item) => item.Description === newItem.Description
      );

      const newQuantity = parseInt(newItem.Quantity, 10);
      const newUnitPrice = parseFloat(newItem.UnitPrice);
  
      if (existingItemIndex !== -1) {
        // If the description already exists, update the quantity and total
        updatedDetallePedidoData[existingItemIndex].Quantity += newQuantity;
        updatedDetallePedidoData[existingItemIndex].Total += newQuantity * newUnitPrice;
      } else {
        // If the description doesn't exist, add it to the data with the total
        newItem.Quantity = newQuantity;
        newItem.Total = newQuantity * newUnitPrice;
        updatedDetallePedidoData.push(newItem);   
      }    

    });

    updatedDetallePedidoData.forEach((item) => {
      const quantity = parseInt(item.Quantity, 10);
      const unitPrice = parseFloat(item.UnitPrice);
      const total = quantity * unitPrice;
    
      item.Total = total; // Update the 'Total' property for each item
      totalOfTotals += total; // Add the total of the current item to the total of totals
    });

    setDetallePedidoData(updatedDetallePedidoData);
    setTotalInput(totalOfTotals);
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Aquí deberías implementar la lógica para validar las credenciales
    // por ejemplo, con una llamada a un backend o utilizando Firebase
    if (username === 'root' && password === 'root') {
      setIsLoggedIn(true);
    } else {
      alert('Nombre de usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
    {!isLoggedIn ? (
      <div className='center-container'>
        <div className="login-form">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
      </div>
    ) : (
      <div className="container"> {/* Add Bootstrap container */}
        <header className="App-header">
      
        <MenuBar
          showAlmacenOptions = { showAlmacenOptions }
          setShowAlmacenOptions = { setShowAlmacenOptions }
          showMenuOptions = { showMenuOptions }
          setShowMenuOptions = {setShowMenuOptions}
          openCategoriaDetails = { openCategoriaDetails }
          openProductosDetails = { openProductosDetails }
          openPedidosDetails = { openPedidosDetails }
          openPedidosMenuDetails = { openPedidosMenuDetails }
          user = {username}
          handleLogout = {handleLogout}
        />        
        </header>
        <body>
        <TableDataProvider>
          <div>
            {showCategoriaDetails && (
              <BodyMantenimientoCategory
              editRow={editRow}
              updatedDescription={updatedDescription}
              setUpdatedDescription={setUpdatedDescription}
              openModal={openModal}
              setEditRow = {setEditRow}
              modalType="categoria"
              categoryData={categoryData}
              setCategoryData={setCategoryData}
              />
            )}
          
            {showModalCategoria && (
              <ModalCategoria
              descripcionInput = {descripcionInput}
              setDescripcionInput = {setDescripcionInput}			
              setShowModalCategoria = {setShowModalCategoria}
              setCategoryData={setCategoryData}
              />
            )}
          </div>
        </TableDataProvider>
        
        <TableDataProvider>
          <div>
            {showProductosDetails && (
              <BodyMantenimientoProducto // Reuse BodyMantenimiento for PRODUCTOS
                //getTableProps={getTableProps}
                //getTableBodyProps={getTableBodyProps}
                //headerGroups={headerGroups}
                //rows={rows}
                //prepareRow={prepareRow}
                editRow={editRow}
                updatedData={updatedData} // Pass updated data state
                setUpdatedData={setUpdatedData} // Set updated data state	
                //memoDetails={productosDetails} // Pass PRODUCTOS data
                //setMemoDetails={setProductosDetails} // Update PRODUCTOS state
                openModal={openModal}
                setEditRow = {setEditRow}
                modalType="productos"
                productData={productData}
                setProductData={setProductData}
              />
            )}
                    
            {showModalProductos && (
              <ModalProducto // Create a separate Modal for PRODUCTOS
                descripcionInput={descripcionInput}
                setDescripcionInput={setDescripcionInput}
                quantityInput={quantityInput}
                setQuantityInput={setQuantityInput}
                unitPriceInput={unitPriceInput}
                setUnitPriceInput={setUnitPriceInput}
                categoryInput={categoryInput}
                setCategoryInput={setCategoryInput}
                setShowModalProductos={setShowModalProductos}
                //saveProductosDetail={saveProductosDetail}
                setProductData={setProductData}
              />
            )}
          </div>
        </TableDataProvider>
        
        <div>
            {showPedidosDetails && (
              <BodyPedidos 
                //editRow={editRow}
                updatedData={updatedData} // Pass updated data state
                setUpdatedData={setUpdatedData} // Set updated data state	            
                setEditRow = {setEditRow}
                openCrearPedidoDetails = {openCrearPedidoDetails}
                openUpdPedidoDetails = {openUpdPedidoDetails}
                pedidoData={ pedidoData }
                setPedidoData={setPedidoData}
              />
            )}

            {showPedidosMenuDetails && (
              <BodyPedidosMenu/>
            )}
          <TableDataProvider value={detallePedidoData}>
            <div>
            {showCrearPedidoDetails && (
              <BodyCrearPedido // Create a separate Modal for Pedidos
                mesaInput = {mesaInput}
                setMesaInput = {setMesaInput}		
                totalInput = {totalInput}
                setTotalInput = {setTotalInput}			
                openModal = { openModal }
                setPedidoData={setPedidoData}
                modalType="pedidos"
                openPedidoDetails = {openPedidoDetails}                 
                detallePedidoData={detallePedidoData}
                setDetallePedidoData = { setDetallePedidoData }
              />
            )}
            {showModalPedidoDetalle &&(
              <ModalPedidoDetalle
                setShowModalPedidoDetalle = {setShowModalPedidoDetalle}
                setDetallePedidoData={saveDetallePedidoData} 
              /> 
            )}          
            </div>
          </TableDataProvider>
          
          <TableDataProvider value={detallePedidoData}>
            <div>
            {showUpdPedidoDetails && (
              <BodyUpdPedido // Create a separate Modal for Pedidos
                editRow={editRow}
                setEditRow = {setEditRow}
                mesaInput = {mesaInput}
                setMesaInput = {setMesaInput}		
                totalInput = {totalInput}
                setTotalInput = {setTotalInput}			
                clienteInput = {clienteInput}
                setClienteInput = {setClienteInput}	
                idPedido = {idPedido}
                setIdPedido = {setIdPedido}	
                openModal = { openModal }
                setPedidoData={setPedidoData}
                modalType="pedidosUpd"
                openPedidoDetails = {openPedidoDetails}                 
                detallePedidoData={detallePedidoData}
                setDetallePedidoData = { setDetallePedidoData }
              />
            )}
            {showModalPedidoDetalle &&(
              <ModalPedidoDetalle
                setShowModalPedidoDetalle = {setShowModalPedidoDetalle}
                setDetallePedidoData={saveDetallePedidoData} 
              /> 
            )}          
            </div>
          </TableDataProvider>
        </div>
        </body>        
      </div>
    )}
  </div>
  );
}

export default App;