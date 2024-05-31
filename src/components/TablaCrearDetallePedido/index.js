// TablaDetalle.js
import React from 'react';

function TablaCrearDetallePedido({data}) {

const descriptionToTotalMap = {};

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

const uniqueProducts = Object.keys(descriptionToTotalMap);

  return (
    <div className="table-responsive">
        <table className="table table-striped table-bordered">
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
            {uniqueProducts.map((Description, index) => (
                <tr key={index}>
                  <td>{Description}</td>
                  <td>{descriptionToTotalMap[Description].Quantity}</td>
                  <td>{descriptionToTotalMap[Description].UnitPrice.toFixed(2)}</td>
                  <td>{descriptionToTotalMap[Description].Total.toFixed(2)}</td>
                  <td>{/* Add actions buttons here */}</td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
}

export { TablaCrearDetallePedido };