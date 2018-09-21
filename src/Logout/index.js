import React, {Component} from 'react';

const apiURL = 'http://localhost:8000/';
// const apiURL = 'https://ancient-springs-75165.herokuapp.com/'


class Logout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: this.props.userKey,
			userid: this.props.userId
		}
	}
	//makes the logout call to the backend server
	tryLogout = async ()  => {
		if(this.props.loggedIn) {
			const logout = await fetch(apiURL + 'api/logout', {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(this.state)
			});

			//if logout was successful, then calls the parent method to change user logged in status
			const logoutJSON = await logout.json()
			if(logoutJSON.status === 200) {
				this.props.logout(true)
			} else if (logoutJSON.status === 400) {
				this.props.logout(false)
			}
		} else {
			//otherwise takes user to home page
			this.props.history.push('/')
		}
	}
	render(){
		this.tryLogout()
		return <h3>Logout Successful</h3>
	}
}


export default Logout;