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
	setProductData,
	filteredProductData,
	setFilteredProductData
}) {

	const [loading, setLoading] = useState(true);
	const [categoryIds, setCategoryIds] = useState([]);
	const [categoryDescriptions, setCategoryDescriptions] = useState([]);
	const [selectedCategoryDescription, setSelectedCategoryDescription] = useState(''); // Added state
	const [categoryInput, setCategoryInput] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchProdutos(); // Assuming fetchProdutos correctly fetches the data

				if (Array.isArray(data)) {
					// Check if the response is an array
					const modifiedData = data.map(item => ({ id: item.id, description: item.descripcion, quantity: item.stock, unitprice: item.precio, category: item.descripcion_cat }));
					setProductData(modifiedData);
					setFilteredProductData(modifiedData);
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
			setFilteredProductData(updatedProductData);
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
					//const updatedProductData = [...productData];
					//updatedProductData[rowIndex] = updatedData;
					//setProductData(updatedProductData);

					const updatedProductData = productData.slice();
					updatedProductData.splice(rowIndex, 1);
					setProductData(updatedProductData);
					setFilteredProductData(updatedProductData);

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

		const handleScroll = () => {
			if (window.scrollY > 300) {
			  setShowButton(true);
			} else {
			  setShowButton(false);
			}
		  };
		
		  window.addEventListener('scroll', handleScroll);
		
		  // Limpiar el evento al desmontar el componente
		  return () => {
			window.removeEventListener('scroll', handleScroll);
		  };
	}, []);

	const handleSearch = (event, key) => {
		const searchValue = event.target.value.toLowerCase();
		const filtered = productData.filter(
			item => {
				const itemValue = item[key]; // Get the value of item[key]
				return itemValue && itemValue.toString().toLowerCase().includes(searchValue); // Check if itemValue exists before calling toString()
			}
		);
		setFilteredProductData(filtered);
	};

	const [showButton, setShowButton] = useState(false);

	// Función para desplazarse hacia la parte superior
	const scrollToTop = () => {
		window.scrollTo({
		top: 0,
		behavior: 'smooth', // Desplazamiento suave
		});
	};

	return (

		<div>
			<br />
			<br />
			<br />
			<br />
			<br />
			<div className="row col-md-12">
				<h1><b>Productos</b></h1>
			</div>
			<div className="row centerC">
				<div className="col-md-2">
					<div className="input-group">
						<CategoryAutoCompleteInput
							categoryDescriptions={categoryDescriptions}
							categoryIds={categoryIds}
							selectedCategoryDescription={updatedData['category'] || ''}
							onCategorySelect={(selectedCategoryDescription, id) => {
								// Call handleSearch when a category is selected
								handleSearch({ target: { value: selectedCategoryDescription } }, 'category');
							}}
							autoComplete="off"
						/>
					</div>
				</div>
				<div className="col-md-2">
					<button className="btn-gg btn-modal" onClick={() => openModal(modalType)}>
						<img className='' src={require("../../images/ic-add-white.png")} /> Crear Producto
					</button>
				</div>
			</div>
			<br />
			<div className="row ol-md-12 mt-3">
				{loading ? (
					<p>Loading...</p>
				) : productData.length > 0 ? (
					<div className="table-responsive">
						<table className="table table-striped table-bordered tableReporte">
							<thead>
								<tr>
									<th>Descripcion</th>
									<th>Cantidad</th>
									<th>Precio unitario</th>
									<th>Categoria</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{filteredProductData.map((row, rowIndex) => {
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
																(selectedCategoryDescription, id) => {
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
														className="btn-table"
														onClick={() => handleSave(rowIndex, row.id)}
													>
														<img className='' src={require("../../images/ic-save.png")} />
													</button>
												) : (
													<button
														className="btn-table"
														onClick={() => {
															// Enter edit mode and set the initial values
															setEditRow(rowIndex);
															setUpdatedData({ ...productData[rowIndex] });
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
		<div style={{ height: '100px' }}></div>    
      {showButton && (
            <button
              onClick={scrollToTop}
              style={{
                position: 'fixed',
                bottom: '50px',
                right: '50px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Go to the Top
            </button>
      )}
		</div>
	);
}


export { BodyMantenimientoProducto };