import React, { Component } from 'react';

// const apiURL = 'http://localhost:8000/';
// const apiURL = 'https://ancient-springs-75165.herokuapp.com/'
const apiURL = 'https://afternoon-hollows-80618.herokuapp.com/'

class Register extends Component {
	constructor(){
		super();
		this.state = {
			username: "",
			password: "",
			confirm: "",
			location: "",
			passwordCheck: true,
			usernameCheck: true
		}
	}

	//sends register attempt to the backend server
	handleSubmit = async (e) => {
		e.preventDefault();
		if(this.state.password === this.state.confirm) {
			const theBody=JSON.stringify(this.state)
			try {
				const registerResponse = await fetch(apiURL + 'api/register', {
					method: 'POST',
					credentials: 'include',
					body: theBody,
					header: {
						'Content-Type': 'application/json'
					}
				})
				console.log(registerResponse)
		
				const registerResponseJSON = await registerResponse.json();
				console.log(registerResponseJSON)
				//checks status from server
				if(registerResponseJSON.status === 200) {
					this.props.register(this.state.location, registerResponseJSON.userid, registerResponseJSON.key)
				} else if (registerResponseJSON.status === 403) {
					this.setState({
						usernameCheck: false, 
						password: '', 
						confirm: '', 
						location: ''
					})
				}
			
			} catch (err) {

				console.log(err, 'ERROR HERE')
			}
		} else {
			this.setState({
				passwordCheck: false, 
				username: '', 
				password: '', 
				confirm: '', 
				location: ''
			})
		}
	} 



	//allows the user to change the state
	handleChange = (e) => {
		this.setState({[e.target.name]: e.target.value});
	}

	render(){
		return(
			<div className='registerContainer'>
				<div className="register">

					<form className="registerForm" onSubmit={this.handleSubmit}>
						<label>

							Username:<br/>

							<input type='text' name='username' onChange={this.handleChange} value={this.state.username}/>
						</label>

						<label>

							Password:<br/>

							<input type='password' name='password' onChange={this.handleChange} value={this.state.password}/>
						</label>

						<label>

							Confirm:<br/>

							<input type='password' name='confirm' onChange={this.handleChange} value={this.state.confirm}/>

						</label>

						<label>

							Location:<br/>

							<input type='text' name='location' onChange={this.handleChange} value={this.state.location}/>

						</label>
						
						<button>Submit</button>
						{this.state.passwordCheck ? null : <h3>Passwords do not match</h3>}
						{this.state.usernameCheck ? null : <h3>Username already taken. Please use another username</h3>}
					</form>
				</div>
			</div>
		)
	}

}



export default Register;