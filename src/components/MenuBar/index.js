function MenuBar({
  showAlmacenOptions,
  setShowAlmacenOptions,
  openCategoriaDetails,
  openProductosDetails,
  openPedidosDetails

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
              onClick={openPedidosDetails}
            >
            PEDIDOS
            </button>
          </li>
        </ul>
	)	
}

export { MenuBar };