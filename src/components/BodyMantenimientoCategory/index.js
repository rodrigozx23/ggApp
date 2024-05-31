import React, { useEffect, useState } from 'react';
import { fetchCategories, updateCategory, deleteCategory } from '../../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';

function BodyMantenimientoCategory({
  editRow,
  updatedDescription,
  setUpdatedDescription,
  openModal,
  setEditRow,
  modalType,
  categoryData,
  setCategoryData
}) {

  const [loading, setLoading] = useState(true);

  // Fetch category data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories(); // Assuming fetchCategories correctly fetches the data
        if (Array.isArray(data)) {
          // Check if the response is an array
          const modifiedData = data.map(item => ({ id: item.id, description: item.descripcion }));
          setCategoryData(modifiedData);
          //setCategoryData(data);

          setLoading(false)
        } else {
          console.error('Cat Error: Data received from the API is not an array.');
        }
      } catch (error) {
        console.error('Cat Error fetching data:', error);
      }
    };
    fetchData();
  }, [setCategoryData]);

  const handleSave = async (rowIndex, category_id) => {
    try {
      const updatedData = await updateCategory({
        category_id,
        updatedDescription,
      });
      // Update the category data after a successful update
      let modifiedData = {
        id: updatedData.id,
        description: updatedData.descripcion,
        // Include other properties if needed
      };
      const updatedCategoryData = [...categoryData];
      updatedCategoryData[rowIndex] = modifiedData;
      setCategoryData(updatedCategoryData);

      // Exit edit mode
      setEditRow(null);
    } catch (error) {
      // Handle errors from the updateCategory function
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (rowIndex, id) => {
    try {
      const confirmMessage = "Are you sure you want to delete this Category?";
      // Call the insertCategory function to send the POST request
      if (window.confirm(confirmMessage)) {

        const updatedData = await deleteCategory(id);
        if (updatedData) {
          //const updatedCategoryData = [...categoryData];
          //updatedCategoryData[rowIndex] = updatedData;
          //setCategoryData(updatedCategoryData);

          const updatedCategoryData = categoryData.slice();
          updatedCategoryData.splice(rowIndex, 1);
          setCategoryData(updatedCategoryData);

          // Exit edit mode
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
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="col-md-10">
        <h1><b>Categorias</b></h1>
      </div>
      <br />
      <div className="col-md-2">
        <button className="btn-gg btn-modal" onClick={() => openModal(modalType)}>
          <img className='' src={require("../../images/ic-add-white.png")} /> Agregar Categoria
        </button>
      </div>
      <br />
      <div className="col-md-12 mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : categoryData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-bordered tableReporte">
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                      <td>
                        {editRow === rowIndex ? (
                          // Show input field when in edit mode
                          <input
                            type="text"
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                          />
                        ) : (
                          // Display description when not in edit mode
                          row.description
                        )}
                      </td>
                      <td>
                        {editRow === rowIndex ? (
                          <button
                            className="btn-table"
                            onClick={() => handleSave(rowIndex, row.id)}
                          >
                            <img className='' src={require("../../images/ic-save.png")} />
                          </button>
                        ) : (
                          <button
                            className="btn-table"
                            onClick={() => {
                              // Enter edit mode and set the initial value
                              setEditRow(rowIndex);
                              setUpdatedDescription(row.description);
                            }}
                          >
                            <img className='' src={require("../../images/ic-edit.png")} />
                          </button>
                        )}
                        &nbsp;
                        <button
                          className="btn-table"
                          onClick={() => handleDelete(rowIndex, row.id)}
                        >
                          <img className='' src={require("../../images/ic-delete.png")} />
                        </button>
                        &nbsp;
                        {editRow === rowIndex ? (
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
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No category data available.</p>
        )}
      </div>
    </div>
  );
}

export { BodyMantenimientoCategory };
