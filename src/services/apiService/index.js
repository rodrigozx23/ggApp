// CATEGORIAS

export const fetchCategories = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/categories/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

export const updateCategory = async ({ category_id, updatedDescription }) => {
  try {
	console.log('/categories/'+category_id);
    const response = await fetch('http://127.0.0.1:8000/categories/'+category_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: category_id, description: updatedDescription, status: true }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update category: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const insertCategory = async ({ updatedDescription }) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/categories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: "0", description: updatedDescription, status: true }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update category: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

// PRODUCTOS

export const fetchProdutos = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/products/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

export const updateProduct = async ({ product_id, updatedDescription, updatedQuantity, updatedUnitPrice, updatedCategory }) => {
  try {
	console.log('/products/'+product_id);
    const response = await fetch('http://127.0.0.1:8000/products/'+product_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          id: product_id, 
          description: updatedDescription, 
          quantity: updatedQuantity, 
          unitprice: updatedUnitPrice, 
          category: updatedCategory,           
          status: true }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update category: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const insertProduct = async ({ product_id, updatedDescription, updatedQuantity, updatedUnitPrice, updatedCategory }) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          id: product_id, 
          description: updatedDescription, 
          quantity: updatedQuantity, 
          unitprice: updatedUnitPrice, 
          category: updatedCategory,           
          status: true }),
    });
     if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update category: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};
// Aqui iria el insert si tuviera uno asi como el de pedidos :'v

// PEDIDOS 

export const insertPedido = async ({ pedido_id, updatedMesa, updatedCliente, updatedTotal, updatedEstadoPedido }) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/pedidos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          id: pedido_id, 
          mesa: updatedMesa, 
          cliente: updatedCliente, 
          total: updatedTotal, 
          estadoPedido: updatedEstadoPedido,           
          status: true }),
    });
     if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update Pedido: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const insertPedidoDetalle = async ({ pedido_id, model }) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/pedidodetalles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          idPedido: pedido_id, 
          model: model
        }),
    });
     if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update pedidoDetalle: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const fetchPedidos = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/pedidos/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

export const fetchPedidoDetalles = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/pedidodetalles/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

// OBTENER PEDIDO Y PEDIDO DETALLE

export const getPedidos = async (pedido_id) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/pedidos/'+pedido_id);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

export const getPedidoDetalles = async (pedido_id) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/getpedidodetallesbypedido/'+pedido_id);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

// UPDATE PEDIDO PEDIDODETALLE

export const updatePedido = async ({ pedido_id, updatedMesa, updatedCliente, updatedTotal, updatedEstadoPedido}) => {
  try {
	console.log('/pedidos/'+pedido_id);
    const response = await fetch('http://127.0.0.1:8000/pedidos/'+pedido_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: pedido_id, 
        mesa: updatedMesa, 
        cliente: updatedCliente, 
        total: updatedTotal, 
        estadoPedido: updatedEstadoPedido,
        status: true }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update Pedido: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const updatePedidoDetalle = async ({ pedido_id, model }) => {
  try {
	console.log('/pedidodetalles/'+pedido_id);
  console.log(model);
    const response = await fetch('http://127.0.0.1:8000/pedidodetalles/'+pedido_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          id: pedido_id, 
          model: model         
        }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update PedidoDetalle: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const updateDetallePed = async ({ pedidodet_id, updatedQuantity, updatedUnitPrice, updatedTotal }) => {
  try {
	console.log('/detallepedido/'+pedidodet_id);
    const response = await fetch('http://127.0.0.1:8000/detallepedido/'+pedidodet_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          id: pedidodet_id, 
          //idProducto: updatedDescription, 
          Quantity: updatedQuantity, 
          //UnitPrice: updatedUnitPrice, 
          Total: updatedTotal,           
          //estadoPedidoDetalle: true,
          status: updatedQuantity == 0 ? false : true
        }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update category: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const deletePedidoDetalle = async ( pedidodetalle_id ) => {
  try {
	console.log('/pedidodetalles/'+pedidodetalle_id);
    const response = await fetch('http://127.0.0.1:8000/pedidodetalles/'+ pedidodetalle_id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: pedidodetalle_id }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to deletePedidoDetalle: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const deleteProducts = async ( id ) => {
  try {
	console.log('/products/'+id);
    const response = await fetch('http://127.0.0.1:8000/products/'+ id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to deletePedidoDetalle: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const deleteCategory = async ( id ) => {
  try {
	console.log('/categories/'+id);
    const response = await fetch('http://127.0.0.1:8000/categories/'+ id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to deletePedidoDetalle: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};

export const updatePagarPedido = async (pedido_id) => {
  try {
	console.log('/pedidos/'+pedido_id);
    const response = await fetch('http://127.0.0.1:8000/pagarpedidos/'+pedido_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: pedido_id
      }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update Pedido: ${errorData.message}');
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ${error.message}');
  }
};