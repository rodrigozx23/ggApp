// TablaDetalle.js
import React, { useEffect, useState } from 'react';
import { updateDetallePed, deletePedidoDetalle, updatePedido } from '../../services/apiService';

function TablaDetallePedido(
  {
    id,
    data,
    setData,
    type = "",
    editRow = null,
    setEditRow = null,
    totalInput,
    setTotalInput,
    mesaInput = null,
    clienteInput = null
  }) {

  const descriptionToTotalMap = {};
  const [updatedData, setUpdatedData] = useState({});
  const [uniqueProducts, setUniqueProducts] = useState([]);

  if (type == "") {
    if (data != null) {
      data.forEach((product) => {
        const { id, Description, Quantity, UnitPrice } = product;
        const quantity = parseFloat(Quantity);
        const unitPrice = parseFloat(UnitPrice);
        const prodId = parseInt(id);

        if (descriptionToTotalMap[Description]) {
          descriptionToTotalMap[Description].idProducto = prodId;
          descriptionToTotalMap[Description].Quantity += quantity;
          descriptionToTotalMap[Description].Total += quantity * unitPrice;
        } else {
          descriptionToTotalMap[Description] = {
            id: prodId,
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

  const handleSave = async (rowIndex, pedidodet_id, p_quantity, p_unitPrice) => {

    if (!updatedData['quantity'] && !updatedData['unitprice']) {
      alert("No ha realizado ningun cambio.");
      setEditRow(false);
      return;
    }

    var quantity = !updatedData['quantity'] ? p_quantity : updatedData['quantity'];
    var unitprice = !updatedData['unitprice'] ? p_unitPrice : updatedData['unitprice'];
    var total = quantity * unitprice;
    if (!id) {
      // Update the PedidoDetalle data after a successful update
      const updatedPedidoDetalleData = [...data]; // Assuming data is your original array
      updatedPedidoDetalleData[rowIndex] = {
        ...updatedPedidoDetalleData[rowIndex],
        Quantity: quantity,
        UnitPrice: unitprice,
        Total: total,
        status_row: false,
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
    } else {
      try {
        const updatedingData = await updateDetallePed({
          pedido_id: id,
          pedidodet_id,
          updatedQuantity: parseInt(quantity),
          updatedUnitPrice: parseFloat(unitprice),
          updatedTotal: total.toFixed(2),
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
          status_row: false,
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
        if (updatedingData) {
          handleUpdateHeader(mesaInput, clienteInput, totalSum)
        } else {
          // Handle the case when the request was not successful (e.g., display an error message)
          console.error('Pedido detalle not saved: An error occurred');
        }
      } catch (error) {
        // Handle errors from the updateProduct function
        console.error('Error updating PedidoDetalle:', error);
      }
    }
  };

  const handleUpdateHeader = async (mesaInput, clienteInput, totalInput) => {
    try {
      const response = await updatePedido({
        pedido_id: id,
        updatedCliente: clienteInput,
        updatedMesa: mesaInput,
        updatedTotal: totalInput,
        updatedEstadoPedido: "1" //ESTADO CREADO
      });

      // Check if the response is successful and handle it as needed
      if (response) {
      } else {
        // Handle the case when the request was not successful (e.g., display an error message)
        console.error('Pedido not saved: An error occurred');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleDelete = async (rowIndex, pedidodet_id) => {
    try {
      const confirmMessage = "Are you sure you want to delete this pedido detalle?";
      // Call the insertCategory function to send the POST request
      if (window.confirm(confirmMessage)) {

        if (pedidodet_id > 0) {

          //f(uniqueProducts.length == 1) {
          //alert("No se puede eliminar este registro debe tener minimo de un producto en el detalle.");
          //return;
          //}
          // Calculate the total sum excluding the deleted row
          const totalSum = uniqueProducts
            .filter((_, index) => index !== rowIndex)
            .reduce((sum, row) => sum + descriptionToTotalMap[row].Total, 0);
          // Set totalInput state with the calculated totalSum
          setTotalInput(totalSum);

          const updatedingData = await deletePedidoDetalle(pedidodet_id);
          if (updatedingData) {
            const updatedPedidoDetalleData = [...data];
            updatedPedidoDetalleData.splice(rowIndex, 1);
            setData(updatedPedidoDetalleData);

            const updatedUniqueProducts = uniqueProducts.slice();
            updatedUniqueProducts.splice(rowIndex, 1);
            setUniqueProducts(updatedUniqueProducts);

            // Exit edit mode
            setUpdatedData({});
            setEditRow(null);
            handleUpdateHeader(mesaInput, clienteInput, totalSum)
          } else {
            console.error('pedido detalle not saved: An error occurred');
          }
        } else {

          const totalSum = uniqueProducts
            .filter((_, index) => index !== rowIndex)
            .reduce((sum, row) => sum + descriptionToTotalMap[row].Total, 0);
          // Set totalInput state with the calculated totalSum
          setTotalInput(totalSum);

          const updatedPedidoDetalleData = [...data];
          updatedPedidoDetalleData.splice(rowIndex, 1);
          setData(updatedPedidoDetalleData);

          const updatedUniqueProducts = uniqueProducts.slice();
          updatedUniqueProducts.splice(rowIndex, 1);
          setUniqueProducts(updatedUniqueProducts);
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
                <td>{row}</td>
                <td>
                  {
                    editRow === index ? (
                      // Show input field when in edit mode
                      <input
                        type="text"
                        value={updatedData['quantity'] || descriptionToTotalMap[row].Quantity}
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
                <td>
                  {
                    editRow === index ? (
                      // Show input field when in edit mode
                      <input
                        type="text"
                        value={updatedData['unitprice'] || descriptionToTotalMap[row].UnitPrice}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d*\.?\d*$/.test(inputValue)) {
                            const updatedValue = { ...updatedData };
                            updatedValue['unitprice'] = inputValue;
                            setUpdatedData(updatedValue);
                          }
                        }}
                      />
                    ) : (
                      descriptionToTotalMap[row].UnitPrice
                    )//<!--<td>{descriptionToTotalMap[row].UnitPrice.toFixed(2)}</td>-->
                  }
                </td>
                <td>{descriptionToTotalMap[row].Total.toFixed(2)}</td>
                <td>
                  {editRow === index ? (
                    <button
                      className="btn-table"
                      onClick={() => handleSave(index, descriptionToTotalMap[row].id, descriptionToTotalMap[row].Quantity, descriptionToTotalMap[row].UnitPrice)}
                    >
                      <img className='' src={require("../../images/ic-save.png")} />
                    </button>
                  ) : (
                    <button
                      className="btn-table"
                      onClick={() => {
                        // Enter edit mode and set the initial values
                        setEditRow(index);
                        setUpdatedData({ ...uniqueProducts[index] });
                      }}>
                      <img className='' src={require("../../images/ic-edit.png")} />
                    </button>
                  )}
                  &nbsp;
                  <button
                    className="btn-table"
                    onClick={() => handleDelete(index, null)}>
                    <img className='' src={require("../../images/ic-delete.png")} />
                  </button>
                  &nbsp;
                  {editRow === index ? (
                    <button
                      className="btn-table"
                      onClick={() => setEditRow(false)}>
                      <img className='' src={require("../../images/ic-cancel-gg.png")} />
                    </button>
                  ) : (
                    <span></span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            uniqueProducts.map((row, index) => {
              return (
                <tr key={index}>
                  <td>{descriptionToTotalMap[row].Description}</td>
                  <td>
                    {
                      editRow === index ? (
                        // Show input field when in edit mode
                        <input
                          type="text"
                          value={updatedData['quantity'] || descriptionToTotalMap[row].Quantity}
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
                  <td>
                    {
                      editRow === index ? (
                        // Show input field when in edit mode
                        <input
                          type="text"
                          value={updatedData['unitprice'] || descriptionToTotalMap[row].UnitPrice}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^\d*\.?\d*$/.test(inputValue)) {
                              const updatedValue = { ...updatedData };
                              updatedValue['unitprice'] = inputValue;
                              setUpdatedData(updatedValue);
                            }
                          }}
                        />
                      ) : (
                        descriptionToTotalMap[row].UnitPrice
                      )//<!--<td>{descriptionToTotalMap[row].UnitPrice.toFixed(2)}</td>-->
                    }
                  </td>
                  <td>{descriptionToTotalMap[row].Total.toFixed(2)}</td>
                  <td>
                    {editRow === index ? (
                      <button
                        className="btn-table"
                        onClick={() => handleSave(index, descriptionToTotalMap[row].id, descriptionToTotalMap[row].Quantity, descriptionToTotalMap[row].UnitPrice)}
                      >
                        <img className='' src={require("../../images/ic-save.png")} />
                      </button>
                    ) : (
                      <button
                        className="btn-table"
                        onClick={() => {
                          // Enter edit mode and set the initial values
                          setEditRow(index);
                          setUpdatedData({ ...uniqueProducts[index] });
                        }}
                      >
                        <img className='' src={require("../../images/ic-edit.png")} />
                      </button>
                    )}
                    &nbsp;
                    <button
                      className="btn-table"
                      onClick={() => handleDelete(index, descriptionToTotalMap[row].id)}>
                      <img className='' src={require("../../images/ic-delete.png")} />
                    </button>
                    &nbsp;
                    {editRow === index ? (
                      <button
                        className="btn-table"
                        onClick={() => setEditRow(false)}
                      >
                        <img className='' src={require("../../images/ic-cancel-gg.png")} />
                      </button>
                    ) : (
                      <span></span>
                    )}
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

export { TablaDetallePedido };