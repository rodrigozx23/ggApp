import React, { useEffect, useState } from 'react';
import { insertCategory } from '../../../../services/apiService';

function ModalCategoria({
	descripcionInput,
	setDescripcionInput,
	setShowModalCategoria,
	setCategoryData
}){
	const handleInsert = async ( descripcionInput) => {
		try {
		  // Call the insertCategory function to send the POST request
		  const response = await insertCategory({ updatedDescription: descripcionInput });

		  // Check if the response is successful and handle it as needed
		  if (response) {
			// Optionally, you can add code to update your UI or take other actions upon success
			console.log('Category saved successfully:', response);

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
	
	return(
		<div className="modal">
            <div className="modal-content">
				<div class="modal-header">
					<div className="row">
						<div className="col-md-12"> 
							<h2>Crear Categoria</h2>
						</div>          
					</div>
				</div>
				<div class="modal-body">
					<div className="container">
						<div className="row mt-3"> 
							<div className="form-group">
								<div className="row">
									<div className="col-md-2"> 
										<p>Ingresa categoria:</p>
									</div>
									<div className="col-md-10">
										<input
											type="text"
											className="form-control"
											placeholder="Descripcion"
											value={descripcionInput}
											onChange={(e) => setDescripcionInput(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>					
				</div>
				<div class="modal-footer">
					<button
						className="btn btn-success mt-3" // Add margin top class
						onClick={() => handleInsert(descripcionInput)}
					>
						Save
					</button>
					<button
						className="btn btn-danger mt-3" // Add margin top class
						onClick={() => {
							setDescripcionInput('');
							setShowModalCategoria(false)
						}}
					>
						Close
					</button>
				</div>
            </div>
        </div>
	)	
}



export { ModalCategoria };