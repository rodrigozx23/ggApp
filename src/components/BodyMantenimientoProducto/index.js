import React, { useEffect, useState } from 'react'; // Add this line to import React
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchProdutos, updateProduct, fetchCategories, deleteProducts } from '../../services/apiService';
import { CategoryAutoCompleteInput } from '../AutoCompleteInput/CategoryAutoCompleteInput'; 

function BodyMantenimientoProducto({
  editRow,
  updatedData,
  setUpdatedData,
  openModal,
  setEditRow,
  modalType,
  productData, 
  setProductData
}) {
	
	const [loading, setLoading] = useState(true);
	const [categoryIds, setCategoryIds] = useState([]);
	const [categoryDescriptions, setCategoryDescriptions] = useState([]);
	const [selectedCategoryDescription, setSelectedCategoryDescription] = useState(''); // Added state
	const [categoryInput, setCategoryInput] = useState('');
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
	const fetchData = async () => {
	  try {
		const data = await fetchProdutos(); // Assuming fetchProdutos correctly fetches the data

		if (Array.isArray(data)) {
		  // Check if the response is an array
		  const modifiedData = data.map(item => ({ id: item.id, description: item.descripcion, quantity: item.stock, unitprice: item.precio, category: item.descripcion_cat}));
		  setProductData(modifiedData);
		  setFilteredData(modifiedData);
		  setLoading(false)
		} else {
		  console.error('Error: Data received from the API is not an array.');
		}
	  } catch (error) {
		console.error('Error fetching data:', error);
	  }
	};
	fetchData();
	}, [setProductData]);

	const handleSave = async (rowIndex, product_id) => {
		try {
		  const updatedingData = await updateProduct({
			product_id,
			updatedDescription: updatedData['description'],
			updatedQuantity: updatedData['quantity'],
			updatedUnitPrice: updatedData['unitprice'],
			updatedCategory: updatedData['id_categoria'],
		  });

		  let modifiedData = {
			id: updatedingData.id,
			description: updatedingData.descripcion,
			quantity: updatedingData.stock,
			unitprice: updatedingData.precio,
			category: updatedingData.descripcion_cat,
			// Include other properties if needed
		  };
		  // Update the product data after a successful update
		  const updatedProductData = [...productData];
		  updatedProductData[rowIndex] = modifiedData;
		  setProductData(updatedProductData);
		  setFilteredData(updatedProductData);
		  // Exit edit mode
		  setEditRow(null);
		} catch (error) {
		  // Handle errors from the updateProduct function
		  console.error('Error updating product:', error);
		}
	};

	const handleDelete = async (rowIndex, id) => {
		try {
		  const confirmMessage = "Are you sure you want to delete this Category?";
		  // Call the insertCategory function to send the POST request
		  if (window.confirm(confirmMessage)) {
		  
			const updatedData = await deleteProducts(id);
			if (updatedData) {
			  alert("Success");
			  //const updatedProductData = [...productData];
			  //updatedProductData[rowIndex] = updatedData;
			  //setProductData(updatedProductData);
			  
			  const updatedProductData = productData.slice();
			  updatedProductData.splice(rowIndex, 1);
			  setProductData(updatedProductData);

			  // Exit edit mode
			  setEditRow(null);
			} else {
			  console.error('productos not saved: An error occurred');
			}
		  }
	  
		} catch (error) {
		  // Handle errors from the updateProduct function
		  console.error('Error deleting productos:', error);
		}
	  };

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const data = await fetchCategories(); // Assuming fetchCategories correctly fetches the data
	
			if (Array.isArray(data)) {
			  // Extract category descriptions from the response and set them in state
			  const modifiedData = data.map(item => ({ id: item.id, description: item.descripcion }));
			  const descriptions = modifiedData.map(item => item.description);
			  const ids = data.map((item) => item.id);
			  setCategoryDescriptions(descriptions);
			  setCategoryIds(ids);
			} else {
			  console.error('Error: Data received from the API is not an array.');
			}
		  } catch (error) {
			console.error('Error fetching data:', error);
		  }
		};
		fetchData();
	}, []);

	const handleSearch = (event, key) => {
		const searchValue = event.target.value.toLowerCase();
		const filtered = productData.filter(
			item => {
				const itemValue = item[key]; // Get the value of item[key]
				return itemValue && itemValue.toString().toLowerCase().includes(searchValue); // Check if itemValue exists before calling toString()
			}
		);
		setFilteredData(filtered);
	};

  return (
  
    <div className="row mt-3 content">
	  <div className="col-md-10">
	  	<h1><b>Product</b></h1>
	  </div>
	  <div className="col-md-2">
	    <button className="btn btn-primary mt-3" onClick={() => openModal(modalType)}>
          Add Product
        </button>
	  </div>
	  <div className="row mb-3">
		<div className="col-md-3">
			<div className="input-group">
				<CategoryAutoCompleteInput
					categoryDescriptions={categoryDescriptions}
					categoryIds={categoryIds}
					selectedCategoryDescription={updatedData['category'] || ''}
					onCategorySelect={(selectedCategoryDescription, id) => {
						// Call handleSearch when a category is selected
						handleSearch({ target: { value: selectedCategoryDescription } }, 'category');
					}}
				/>
			</div>
		</div>
	  </div>
      <div className="col-md-12 mt-3">
	    {loading ? (
          <p>Loading...</p>
        ) : productData.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
               <tr>
                  <th>Description</th>
				  <th>Quantity</th>
				  <th>UnitPrice</th>
				  <th>Category</th>
                  <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => {
                return (
				  <tr key={rowIndex}>
					<td>
						{
							editRow === rowIndex ? (
							// Show input field when in edit mode
							  <input
								type="text"
								value={updatedData['description'] || ''}
								onChange={(e) => {
								  const updatedValue = { ...updatedData };
								  updatedValue['description'] = e.target.value;
								  setUpdatedData(updatedValue);
								}}
							  />
							) : (                       
							  row.description
							)
						}
					</td>	
					<td>
						{
							editRow === rowIndex ? (
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
							  row.quantity
							)
						}
					</td>	
					<td>
						{
							editRow === rowIndex ? (
							// Show input field when in edit mode
								<input
								  type="text"
								  value={updatedData['unitprice'] || ''}
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
							  row.unitprice
							)
						}
					</td>
					<td>
						{
							editRow === rowIndex ? (
							// Show input field when in edit mode
								<CategoryAutoCompleteInput
								categoryDescriptions={categoryDescriptions}
								categoryIds={categoryIds}
								selectedCategoryDescription={updatedData['category'] || ''}
								onCategorySelect={
									(selectedCategoryDescription, id) => 
									{
										const updatedValue = { ...updatedData };
										updatedValue['category'] = selectedCategoryDescription;
										updatedValue['id_categoria'] = id;
										setUpdatedData(updatedValue);										
									}
								}
							  />
							) : (                       
							  row.category
							)
						}
					</td>
                    <td>
                    {editRow === rowIndex ? (
						<button
							className="btn btn-success"
							onClick={() => handleSave(rowIndex, row.id)}
						>
						Save
						</button>
						) : (
						<button
							className="btn btn-primary"
							onClick={() => {
							// Enter edit mode and set the initial values
							setEditRow(rowIndex);
							setUpdatedData({ ...productData[rowIndex] });
							}}
						>
                        Edit
                        </button>
                    )}
						&nbsp;
						<button
							className="btn btn-warning"
							onClick={() => handleDelete(rowIndex, row.id)}
							>
							Delete
						</button>
						&nbsp;
					{editRow === rowIndex ? (
						<button
							className="btn btn-danger"
							onClick={() => setEditRow(false)}
						>
							Cancel
						</button>
					):(
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


export { BodyMantenimientoProducto };