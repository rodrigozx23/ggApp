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
  user,
  handleLogout,
  handleActiveIndex,
  activeIndex
}){

  const handleClick = (index) => {
    handleActiveIndex(index);
  };

	return(
		<ul className="menu-bar">
          <li className="menu-item">
            <button 
              className="btn-pedidos" 
              onClick={() => {
                openCrearPedidoDetails();
              }}
            >
            Agregar Pedido
            </button>
          </li>
          <br />
          <br />
          <br />
          <br />
          <li className="menu-item">
              <button
              key={0}
              className={`menu-button ${activeIndex === 0 ? 'active' : ''}`}
              onClick={() => {
                  openPedidosDetails()
                  handleClick(0)
              }}>
              <img className='icMenu' src={require("../../images/ic-timer.png")} />
              Pedidos
            </button>
          </li>
          <li className="menu-item">
            <button
              key={1}
              className={`menu-button ${activeIndex === 1 ? 'active' : ''}`}
              onClick={() => {
                openCategoriaDetails()
                handleClick(1)
            }}>
              <img className='icMenu' src={require("../../images/ic-list.png")} />
              Categoria
            </button>
          </li>
          <li className="menu-item">
            <button
              key={2}
              className={`menu-button ${activeIndex === 2 ? 'active' : ''}`}
              onClick={() => {
                openProductosDetails()
                handleClick(2)
            }}>
              <img className='icMenu' src={require("../../images/ic-fast-food.png")} />
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