const user = 0;
const timestamp = Date.now();
const date = new Date(timestamp).toISOString();
// CATEGORIAS

export const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:8080/gg/categoria', {
      method: 'GET' // Adjust the method accordingly
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('API request failed: ' + error.message);
  }
};

export const updateCategory = async ({ category_id, updatedDescription }) => {
  try {
    const apiUrl = 'http://localhost:8080/gg/categoria/' + category_id;
	  console.log('PUT request to:', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'PUT',
      body: JSON.stringify({  
        descripcion: updatedDescription, 
        fecha_creacion: date,
        user_id_creacion: user,
        fecha_modificacion: date,
        user_id_modificacion: user,
        estado: true 
      }),
    });

    if (response.ok) {     
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update category:'+ errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+ error.message);
  }
};

export const insertCategory = async ({ updatedDescription }) => {
  try {
    const response = await fetch('http://localhost:8080/gg/categoria', {
      method: 'POST',
      body: JSON.stringify({ 
        descripcion: updatedDescription, 
        fecha_creacion: date,
        user_id_creacion: user,
        fecha_modificacion: date,
        user_id_modificacion: user
      }),      
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to insert category:'+errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ' + error.message);
  }
};

export const deleteCategory = async ( id ) => {
  try {
	console.log('/categories/'+id);
    const response = await fetch('http://localhost:8080/gg/categoria/'+ id, {
      method: 'DELETE',
      body: JSON.stringify({ id: id }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to delete categoria:'+errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: ' + error.message);
  }
};

// PRODUCTOS

export const fetchProdutos = async () => {
  try {
    const response = await fetch('http://localhost:8080/gg/producto',{
      method: 'GET' // Adjust the method accordingly
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const products = await response.json();

    const responseCat = await fetch('http://localhost:8080/gg/categoria', {
      method: 'GET' // Adjust the method accordingly
    });
    if (!responseCat.ok) {
      throw new Error(`API request failed with status ${responseCat.status}`);
    }
    const categories = await responseCat.json();

    // Find the object in data with matching id_categoria
    const newArray = products.map(product => {
      const matchingCategory = categories.find(category => category.id === product.id_categoria);
      
      if (matchingCategory) {
        return {
          ...product,
          descripcion_cat: matchingCategory.descripcion,
        };
      }
  
      return product;
    });
    return newArray;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

export const updateProduct = async ({ product_id, updatedDescription, updatedQuantity, updatedUnitPrice, updatedCategory }) => {
  try {
    const apiUrl = 'http://localhost:8080/gg/producto/' + product_id;
	  console.log('PUT request to:', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'PUT',
      body: JSON.stringify(
        { 
          descripcion: updatedDescription, 
          stock: parseFloat(updatedQuantity), 
          precio: parseFloat(updatedUnitPrice), 
          id_categoria: parseInt(updatedCategory),
          fecha_creacion: date,
          user_id_creacion: user,
          fecha_modificacion: date,
          user_id_modificacion: user,          
          estado: true 
        }
      ),      
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const product = await response.json(); // Parse the response body as JSON
      const responseCat = await fetch('http://localhost:8080/gg/categoria', {
        method: 'GET', // Adjust the method accordingly
      });
    
      if (!responseCat.ok) {
        throw new Error(`Failed to fetch category data with status ${responseCat.status}`);
      }
    
      const categories = await responseCat.json();
      // Find the matching category for the single product
      const matchingCategory = categories.find(category => category.id === product.id_categoria);

      // Create a new object with added descripcion_cat
      const newObject = matchingCategory
        ? {
            ...product,
            descripcion_cat: matchingCategory.descripcion,
          }
        : product;

      return newObject; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update product:'+ errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error:'+ error.message);
  }
};

export const insertProduct = async ({ product_id, updatedDescription, updatedQuantity, updatedUnitPrice, updatedCategory }) => {
  try {
    const response = await fetch('http://localhost:8080/gg/producto', {
      method: 'POST',
      body: JSON.stringify(
        { 
          descripcion: updatedDescription, 
          stock: parseFloat(updatedQuantity), 
          precio: parseFloat(updatedUnitPrice), 
          id_categoria: parseInt(updatedCategory),
          fecha_creacion: date,
          user_id_creacion: user,
          fecha_modificacion: date,
          user_id_modificacion: user,              
          estado: true }),
    });
     if (response.ok) {
      const product = await response.json();
      
      const responseCat = await fetch('http://localhost:8080/gg/categoria', {
        method: 'GET', // Adjust the method accordingly
      });
    
      if (!responseCat.ok) {
        throw new Error(`Failed to fetch category data with status ${responseCat.status}`);
      }
    
      const categories = await responseCat.json();
      // Find the matching category for the single product
      const matchingCategory = categories.find(category => category.id === product.id_categoria);

      // Create a new object with added descripcion_cat
      const newObject = matchingCategory
        ? {
            ...product,
            descripcion_cat: matchingCategory.descripcion,
          }
        : product;

      console.log(newObject);
      return newObject; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update product: '+errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+error.message);
  }
};

export const deleteProducts = async ( id ) => {
  try {
	console.log('/products/'+id);
    const response = await fetch('http://localhost:8080/gg/producto/'+ id, {
      method: 'DELETE',
      body: JSON.stringify({ id: id }),
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to delete producto: '+errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+error.message);
  }
};

// Aqui iria el insert si tuviera uno asi como el de pedidos :'v

// PEDIDOS - Insertar y obtener pedido

export const insertPedido = async ({ pedido_id, updatedMesa, updatedCliente, updatedTotal, updatedEstadoPedido }) => {
  try {
    const response = await fetch('http://localhost:8080/gg/pedido', {
      method: 'POST',
      body: JSON.stringify(
        { 
          mesa: parseInt(updatedMesa),
          cliente: updatedCliente, 
          total:  parseFloat(updatedTotal),
          fecha_creacion: date,
          user_id_creacion: user,
          fecha_modificacion: date,
          user_id_modificacion: user        
        }),
    });
    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to insert Pedido: '+ errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+ error.message);
  }
};

export const insertPedidoDetalle = async ({ pedido_id, model }) => {
  const results = [];
  try {
    for (const item of model) {
      const response = await fetch('http://localhost:8080/gg/pedido_detalle', {
        method: 'POST',
        body: JSON.stringify(
          { 
            id_pedido: parseInt(pedido_id), 
            id_producto: parseInt(item.idProducto),
            cantidad: parseInt(item.Quantity),
            precio_unitario: parseFloat(item.UnitPrice), 
            precio_total: parseFloat(item.Total),
            fecha_creacion: date,
            user_id_creacion: user,
            fecha_modificacion: date,
            user_id_modificacion: user 
          }),
      });
      if (response.ok) {
        const data = await response.json(); // Parse the response body as JSON
        results.push(data);
      } else {
        // Handle the error or response status here
        const errorData = await response.json(); // Parse the error response as JSON if available
        throw new Error('Failed to insert pedidoDetalle: '+ errorData.message);
      }   
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+ error.message);
  }
  return results; // Return the response data
};

export const fetchPedidos = async () => {
  try {
    const response = await fetch('http://localhost:8080/gg/pedido', {
      method: 'GET' // Adjust the method accordingly
    });
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
    const response = await fetch('http://localhost:8080/gg/pedido/'+pedido_id);
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
    const response = await fetch('http://localhost:8080/gg/pedido_completo/'+pedido_id);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    //const data = await response.json();
     
    const pedidosDetalle = await response.json();

    const responseProd = await fetch('http://localhost:8080/gg/producto', {
      method: 'GET' // Adjust the method accordingly
    });
    if (!responseProd.ok) {
      throw new Error(`API request failed with status ${responseProd.status}`);
    }
    const productos = await responseProd.json();

    // Find the object in data with matching id_categoria
    const newArray = pedidosDetalle.detalle.map(pedido => {
      const matchingProducto = productos.find(producto => producto.id === pedido.id_producto);
      
      if (matchingProducto) {
        return {
          ...pedido,
          descripcion: matchingProducto.descripcion,
        };
      }
  
      return pedido;
    });    
    return newArray;

    //return data.detalle;
  } catch (error) {
    throw new Error('API request failed: ' + error.message);
  }
};

// UPDATE PEDIDO PEDIDODETALLE

export const updatePedido = async ({ pedido_id, updatedMesa, updatedCliente, updatedTotal, updatedEstadoPedido}) => {
  try {
    const response = await fetch('http://localhost:8080/gg/pedido/'+pedido_id, {
      method: 'PUT',
      body: JSON.stringify(
        {
          mesa: parseInt(updatedMesa), 
          cliente: updatedCliente, 
          total: parseFloat(updatedTotal),           
          fecha_creacion: date,
          user_id_creacion: user,
          fecha_modificacion: date,
          user_id_modificacion: user,   
          //estadoPedido: updatedEstadoPedido,
          estado: true 
        }
        )
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update Pedido: '+ errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+ error.message);
  }
};

export const updatePedidoDetalle = async ({ pedido_id, model }) => {
  console.log("updatePedidoDetalle")
  const results = [];
  console.log(model)
  try {
    for (const item of model) {
      console.log("updatePedidoDetalle - model")
      console.log(item)
      if(item.id == 0){
        const response = await fetch('http://localhost:8080/gg/pedido_detalle/'+item.id, {
        method: 'PUT',
        body: JSON.stringify(
          { 
            id_pedido: pedido_id,
            cantidad: parseInt(item.Quantity), 
            precio_unitario: parseFloat(item.UnitPrice), 
            precio_total: parseFloat(item.Total),           
            fecha_creacion: date,
            user_id_creacion: user,
            fecha_modificacion: date,
            user_id_modificacion: user,   
            estado: item.Quantity == 0 ? false : true     
          }
        )
        });

        if (response.ok) {
          const data = await response.json(); // Parse the response body as JSON
          results.push(data);
        } else {
          // Handle the error or response status here
          const errorData = await response.json(); // Parse the error response as JSON if available
          throw new Error('Failed to update PedidoDetalle: '+ errorData.message);
        }
      }

      else if(item.idProducto){
        console.log("updatePedidoDetalle - idProducto")
        console.log(item)
        const response = await fetch('http://localhost:8080/gg/pedido_detalle', {
        method: 'POST',
        body: JSON.stringify(
            { 
              id_pedido: parseInt(pedido_id), 
              id_producto: parseInt(item.idProducto),
              cantidad: parseInt(item.Quantity),
              precio_unitario: parseFloat(item.UnitPrice), 
              precio_total: parseFloat(item.Total),
              fecha_creacion: date,
              user_id_creacion: user,
              fecha_modificacion: date,
              user_id_modificacion: user 
            }),
        });
        if (response.ok) {
          const data = await response.json(); // Parse the response body as JSON
          results.push(data);
        } else {
          // Handle the error or response status here
          const errorData = await response.json(); // Parse the error response as JSON if available
          throw new Error('Failed to insert new PedidoDetalle: '+ errorData.message);
        }
      }
      console.log("results")
      console.log(results)
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+ error.message);
  }
  return model;
};

export const updateDetallePed = async ({ pedido_id, pedidodet_id, updatedQuantity, updatedUnitPrice, updatedTotal }) => {
  try {
	  console.log("updateDetallePed/detallepedido/"+pedido_id);
    console.log(pedido_id + " - " + pedidodet_id + " - " +  updatedQuantity + " - "+  updatedUnitPrice + " - "+ updatedTotal )
    
    const response = await fetch('http://localhost:8080/gg/pedido_detalle/'+pedidodet_id, {
      method: 'PUT',
      body: JSON.stringify(
        { 
          id_pedido: pedido_id,
          id_producto: 1, // ESTO YA NO DEBE IR EN UPDATE.
          //id: pedidodet_id, 
          //idProducto: updatedDescription, 
          cantidad:  parseInt(updatedQuantity), 
          precio_unitario: parseFloat(updatedUnitPrice), 
          precio_total: parseFloat(updatedTotal),           
          //estadoPedidoDetalle: true,
          fecha_creacion: date,
          user_id_creacion: user,
          fecha_modificacion: date,
          user_id_modificacion: user,   
          estado: updatedQuantity == 0 ? false : true
        }
      ),      
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      //const data = await response.json(); // Parse the response body as JSON
      //return data; // Return the response data
      const pedidosDetalle = await response.json();
      const responseProd = await fetch('http://localhost:8080/gg/producto', {
        method: 'GET' // Adjust the method accordingly
      });
      if (!responseProd.ok) {
        throw new Error(`API request failed with status ${responseProd.status}`);
      }
      const productos = await responseProd.json();
      // Find the matching category for the single product
      const matchingProducto = productos.find(producto => producto.id === pedidosDetalle.id_producto);
      // Create a new object with added descripcion_cat
      const newObject = matchingProducto
        ? {
            ...pedidosDetalle,
            descripcion: matchingProducto.descripcion,
            quantity:pedidosDetalle.cantidad,
            total:pedidosDetalle.precio_total,
            unitprice:pedidosDetalle.precio_unitario,
          }
        : pedidosDetalle;    
      return newObject; // Return the response data
    } else {
      // Handle the error or response status here
      const errorData = await response.json(); // Parse the error response as JSON if available
      throw new Error('Failed to update category: '+ errorData.message);
    }
  } catch (error) {
    // Handle network errors
    throw new Error('Network error: '+ error.message);
  }
};

export const deletePedidoDetalle = async ( pedidodetalle_id ) => {
  try {
    const response = await fetch('http://localhost:8080/gg/pedido_detalle/'+ pedidodetalle_id, {
      method: 'DELETE',
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