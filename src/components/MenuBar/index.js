function MenuBar({
  showAlmacenOptions,
  setShowAlmacenOptions,
  showMenuOptions,
  setShowMenuOptions,
  openCategoriaDetails,
  openProductosDetails,
  openPedidosDetails,
  openPedidosMenuDetails,
  user,
  handleLogout
}){
	return(
		<ul className="menu-bar">
          <li className="menu-item">
            <button
              className="menu-button"
              onClick={() => setShowAlmacenOptions(!showAlmacenOptions)}
            >
              ALMACEN
            </button>
            {showAlmacenOptions && (
              <ul className="submenu">
                <li>
                  <button
                    className="submenu-button"
                    onClick={openCategoriaDetails}
                  >
                    CATEGORIA
                  </button>
                </li>
                <li>
                  <button
                    className="submenu-button"
					          onClick={openProductosDetails}
                  >
                    PRODUCTOS
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li className="menu-item">
            <button
              className="menu-button"
              onClick={() => setShowMenuOptions(!showMenuOptions)}
            >
              PEDIDOS
            </button>
            {showMenuOptions && (
              <ul className="submenu">
                <li>
                  <button
                    className="submenu-button"
                    onClick={openPedidosMenuDetails}
                  >
                    GG Menu
                  </button>
                </li>
                <li>
                  <button
                    className="submenu-button"
					          onClick={openPedidosDetails}
                  >
                    GG Café
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li className="menu-item">
          <button
              className="menu-button"
              onClick={() => setShowMenuOptions(!showMenuOptions)}
            >
              {user}!
            </button>
            {showMenuOptions && (
              <ul className="submenu">
                <li>                
                  <button className="menu-button" onClick={handleLogout}>Cerrar sesión</button>	 
                </li>
              </ul>
            )}
          </li>
        </ul>
	)	
}

export { MenuBar };