import React, { useEffect, useState } from 'react';
import { insertCategory } from '../../../../services/apiService';

function ModalCategoria({
	descripcionInput,
	setDescripcionInput,
	setShowModalCategoria,
	setCategoryData
}) {
	const handleInsert = async (descripcionInput) => {
		try {
			// Call the insertCategory function to send the POST request
			const response = await insertCategory({ updatedDescription: descripcionInput });

			// Check if the response is successful and handle it as needed
			if (response) {
				// Optionally, you can add code to update your UI or take other actions upon success
				const transformedObject = {
					id: response.id,
					description: response.descripcion,
				};

				setCategoryData((prevData) => [...prevData, transformedObject]);
				// Clear the input and close the modal
				setDescripcionInput('');
				setShowModalCategoria(false);
			} else {
				// Handle the case when the request was not successful (e.g., display an error message)
				console.error('Category not saved: An error occurred');
			}
		} catch (error) {
			// Handle network errors
			console.error('Network error:', error);
		}
	};

	return (
		<div className="modal">
			<div className="modal-content modCat">
				<div className="modal-header">
					<div className="row">
						<div className="col-md-12">
							<h4><b>Crear Categoria</b></h4>
						</div>
					</div>
				</div>
				<div className="modal-body">
					<div className="container">
						<div className="row mt-3">
							<div className="form-group">
								<div className="row">
									<div className="col-md-10">
										<div className="placeholder-group">
											<input type="text" id="descripcion" className="placeholder-control form-control" required value={descripcionInput} onChange={(e) => setDescripcionInput(e.target.value)}></input>
											<label htmlFor="descripcion" className="floating-label">Descripcion</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="modal-footer">
					<button
						className="btn-mant" // Add margin top class
						onClick={() => handleInsert(descripcionInput)}
					>
						<img className='' src={require("../../../../images/ic-save-big.png")} />
					</button>
					<button
						className="btn-mant" // Add margin top class
						onClick={() => {
							setDescripcionInput('');
							setShowModalCategoria(false)
						}}
					>
						<img className='' src={require("../../../../images/ic-cancel-big.png")} />
					</button>
				</div>
			</div>
		</div>
	)
}



export { ModalCategoria };