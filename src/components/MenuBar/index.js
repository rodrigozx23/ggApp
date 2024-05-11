function MenuBar({
  showAlmacenOptions,
  setShowAlmacenOptions,
  showMenuOptions,
  setShowMenuOptions,
  openCategoriaDetails,
  openProductosDetails,
  openPedidosDetails,
  openPedidosMenuDetails,
  openReportePedidos,
  user,
  handleLogout
}){
	return(
		<ul className="menu-bar">

                <li className="menu-item">
                  <button
                    className="menu-button"
					          onClick={openPedidosDetails}
                  >
                    PEDIDOS
                  </button>
                </li>
                <li className="menu-item">
                  <button
                    className="menu-button"
					          onClick={openReportePedidos}
                  >
                    Reporte Pedido
                  </button>
          </li>
                <li className="menu-item">
                  <button
                    className="menu-button"
                    onClick={openCategoriaDetails}
                  >
                    CATEGORIA
                  </button>
                </li>
                <li className="menu-item">
                  <button
                    className="menu-button"
					          onClick={openProductosDetails}
                  >
                    PRODUCTOS
                  </button>
          </li>
          <li className="menu-item down">           
          <button className="menu-button" onClick={handleLogout}>Cerrar sesión</button>	 
          </li>
        </ul>
	)	
}

export { MenuBar };