// TablaDetalle.js
import React, { useEffect, useState } from 'react';
import { updateDetallePed, deletePedidoDetalle } from '../../services/apiService';

function TablaDetallePedido(
  {
    data, 
    setData, 
    type = "", 
    editRow = null, 
    setEditRow = null,
    totalInput,
    setTotalInput,
  }) 
{

const descriptionToTotalMap = {};
const [updatedData, setUpdatedData] = useState({});
const [uniqueProducts, setUniqueProducts] = useState([]);

if (type == ""){

  if(data != null){
    data.forEach((product) => {
      const { Description, Quantity, UnitPrice } = product;
      const quantity = parseFloat(Quantity);
      const unitPrice = parseFloat(UnitPrice);
    
      if (descriptionToTotalMap[Description]) {
        descriptionToTotalMap[Description].Quantity += quantity;
        descriptionToTotalMap[Description].Total += quantity * unitPrice;
      } else {
        descriptionToTotalMap[Description] = {
          Quantity: quantity,
          UnitPrice: unitPrice,
          Total: quantity * unitPrice,
        };
      }
    });
  }

} else {

  data.forEach((product) => {
    const { id, Description, Quantity, UnitPrice, Total } = product;
    const quantity = parseFloat(Quantity);
    const unitPrice = parseFloat(UnitPrice);

    if (descriptionToTotalMap[Description]) {
      //descriptionToTotalMap[Description].id = id;
      //descriptionToTotalMap[Description].Description = Description;
      descriptionToTotalMap[Description].Quantity += quantity;
      descriptionToTotalMap[Description].Total += quantity * unitPrice;
    } else {
      const newId = id ? id : 0;
      descriptionToTotalMap[Description] = {
        id: newId,
        Description: Description,
        Quantity: quantity,
        UnitPrice: unitPrice,
        Total: quantity * unitPrice,
      };
    }
  });

}

useEffect(() => {
  // Avoid unnecessary updates by checking if the keys have changed
  const newUniqueProducts = Object.keys(descriptionToTotalMap);
  if (!arraysEqual(uniqueProducts, newUniqueProducts)) {
    setUniqueProducts(newUniqueProducts);
  }
}, [descriptionToTotalMap, uniqueProducts]);

// Helper function to check if two arrays are equal
const arraysEqual = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index])
  );
};

const handleSave = async (rowIndex, pedidodet_id) => {
  try {
    const updatedingData = await updateDetallePed({
      pedidodet_id,
      updatedQuantity: updatedData['quantity'],
      updatedUnitPrice: 0,
      updatedTotal: 0,
    });
    // Update the PedidoDetalle data after a successful update
    const updatedPedidoDetalleData = [...data]; // Assuming data is your original array
    updatedPedidoDetalleData[rowIndex] = {
      ...updatedPedidoDetalleData[rowIndex],
      idProducto: updatedingData.idProducto,
      Quantity: updatedingData.quantity,
      UnitPrice: updatedingData.unitprice,
      Total: updatedingData.total,
      estadoPedidoDetalle: updatedingData.estadoPedidoDetalle,
      status: updatedingData.status,
    };
    // Update the state with the modified data
    setData(updatedPedidoDetalleData);

    // Calculate the total sum after the modification
    const totalSum = updatedPedidoDetalleData.reduce((sum, row) => sum + row.Total, 0);
    // Set totalInput state with the calculated totalSum
    setTotalInput(totalSum);

    // Exit edit mode
    setUpdatedData({});
    setEditRow(null);
  } catch (error) {
    // Handle errors from the updateProduct function
    console.error('Error updating PedidoDetalle:', error);
  }
};

const handleDelete = async (rowIndex, pedidodet_id) => {
  try {
    const confirmMessage = "Are you sure you want to delete this pedido detalle?";
    // Call the insertCategory function to send the POST request
    if (window.confirm(confirmMessage)) {

      if(uniqueProducts.length == 1) {
        alert("No se puede eliminar este registro debe tener minimo de un producto en el detalle.");
        return;
      }

      // Calculate the total sum excluding the deleted row
      const totalSum = uniqueProducts
      .filter((_, index) => index !== rowIndex)
      .reduce((sum, row) => sum + descriptionToTotalMap[row].Total, 0);

      // Set totalInput state with the calculated totalSum
      setTotalInput(totalSum);

      const updatedingData = await deletePedidoDetalle(pedidodet_id);
      if (updatedingData) {
        alert("Success");
        const updatedPedidoDetalleData = [...data];
        updatedPedidoDetalleData.splice(rowIndex, 1);
        setData(updatedPedidoDetalleData);

        const updatedUniqueProducts = uniqueProducts.slice();
        updatedUniqueProducts.splice(rowIndex, 1);
        setUniqueProducts(updatedUniqueProducts);

        // Exit edit mode
        setUpdatedData({});
        setEditRow(null);
      } else {
        console.error('pedido detalle not saved: An error occurred');
      }
    }

  } catch (error) {
    // Handle errors from the updateProduct function
    console.error('Error updating PedidoDetalle:', error);
  }
};

return (
    <div className="table-responsive">
        <table id="tbDetallePedido" className="table table-striped table-bordered">
        <thead>
            <tr>
            <th>ID</th>
            <th>Descripción Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
          {type == "" ? (
           uniqueProducts.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row}</td>
              <td>{descriptionToTotalMap[row].Quantity}</td>
              <td>{descriptionToTotalMap[row].UnitPrice.toFixed(2)}</td>
              <td>{descriptionToTotalMap[row].Total.toFixed(2)}</td>
              <td>{/* Add actions buttons here */}</td>
            </tr>
          ))
          ) : (
            uniqueProducts.map((row, index) => {
              return (
                <tr key={index}>
                  <td>{descriptionToTotalMap[row].id}</td>
                  <td>{descriptionToTotalMap[row].Description}</td>

                  <td>
                    {
                      editRow === index ? (
                      // Show input field when in edit mode
                        <input
                          type="text"
                          value={updatedData['quantity'] || ''}
                          onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d*\.?\d*$/.test(inputValue)) {
                            const updatedValue = { ...updatedData };
                            updatedValue['quantity'] = inputValue;
                            setUpdatedData(updatedValue);
                          }
                        }}
                        />
                      ) : (                       
                        descriptionToTotalMap[row].Quantity
                      )
                    }
                  </td>
                  <td>{descriptionToTotalMap[row].UnitPrice.toFixed(2)}</td>
                  <td>{descriptionToTotalMap[row].Total.toFixed(2)}</td>
                  <td>
                      {editRow === index ? (
                        <button
                          className="btn btn-success"
                          onClick={() => handleSave(index, descriptionToTotalMap[row].id)}
                        >
                        Save
                        </button>
                        ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                          // Enter edit mode and set the initial values
                          setEditRow(index);
                          setUpdatedData({ ...uniqueProducts[index] });
                          }}
                        >
                          Edit
                        </button>
                        )}
                        &nbsp;
                        <button
                          className="btn btn-warning"
                          onClick={() => handleDelete(index, descriptionToTotalMap[row].id)}
                        >
                          Delete
                        </button>
                    </td>
                </tr>
              );
            })
          )}
           
        </tbody>
        </table>
    </div>
  );
}

export { TablaDetallePedido } ;