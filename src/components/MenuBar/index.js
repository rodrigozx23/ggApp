import React, { useState } from 'react';
import styles from '../../App.css';

function MenuBar({
  showAlmacenOptions,
  setShowAlmacenOptions,
  showMenuOptions,
  setShowMenuOptions,
  openCategoriaDetails,
  openProductosDetails,
  openPedidosDetails,
  openCrearPedidoDetails,
  openPedidosMenuDetails,
  openReportePedidos,
  user,
  handleLogout
}){

  const [activeIndex, setActiveIndex] = useState(null); // Initially no active button

  const handleClick = (index) => {
    setActiveIndex(index); // Update active index on click
  };

	return(
		<ul className="menu-bar">
                <li className="menu-item">
                  <button 
                    className="btn-pedidos" 
                    onClick={() => {
                        openCrearPedidoDetails()
                    }}>
                  Agregar Pedido
                  </button>
                </li>
                <li className="menu-item">
                    <button
                    key={0}
                    className={`menu-button ${activeIndex === 0 ? 'active' : ''}`}
					          onClick={() => {
                        openPedidosDetails()
                        handleClick(0)
                    }}>
                    Pedidos
                  </button>
                </li>
                <li className="menu-item">
                  <button
                    key={1}
                    className={`menu-button ${activeIndex === 1 ? 'active' : ''}`}
					          onClick={() => {
                      openReportePedidos()
                      handleClick(1)
                  }}>
                    Reporte
                  </button>
          </li>
                <li className="menu-item">
                  <button
                    key={2}
                    className={`menu-button ${activeIndex === 2 ? 'active' : ''}`}
                    onClick={() => {
                      openCategoriaDetails()
                      handleClick(2)
                  }}>
                    Categoria
                  </button>
                </li>
                <li className="menu-item">
                  <button
                    key={3}
                    className={`menu-button ${activeIndex === 3 ? 'active' : ''}`}
					          onClick={() => {
                      openProductosDetails()
                      handleClick(3)
                  }}>
                    Productos
                  </button>
          </li>
          <li className="menu-item down">           
          <button className="menu-button bold" onClick={handleLogout}>Cerrar sesión</button>	 
          </li>
        </ul>
	)	
}

export { MenuBar };