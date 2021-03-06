import React, { Component } from 'react';
// import Login from './Login';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

// const apiURL = 'http://localhost:8000/';
// const apiURL = 'https://ancient-springs-75165.herokuapp.com/'
const apiURL = 'https://afternoon-hollows-80618.herokuapp.com/'
// 

class SplashContainer extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      error: false,
      test: false,
      authToken: ''
      // skipLogin: null
    }
  }

  //attempts login to backend server
  handleSubmit = async (e) => {
    try{
      e.preventDefault();
      if(this.state.username !== 'TestSMS') {
        const loginResponse = await fetch(apiURL + 'api/login', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        //parses response data to useable objects
        const loginResponseJSON = await loginResponse.json()
        if(loginResponseJSON.status === 200) {
          const loginCategories = await JSON.parse(loginResponseJSON.categories)
          const events = await JSON.parse(loginResponseJSON.events)

          let eventsSorted = []
          if(events.length > 1) {
            eventsSorted = events.sort((a, b) => {
              return a.fields.date - b.fields.date
            })
          } else {
            eventsSorted = events
          }

          const eventsParsed = []
          for(let i = 0; i < eventsSorted.length; i++) {
            eventsParsed.push(eventsSorted[i].fields)
          }

          const userCats = []
          //gets category names from response data
          for(let i = 0; i < loginCategories.length; i++) {
            userCats.push(loginCategories[i].fields.name)
          }  
          this.props.login(loginResponseJSON.userid, userCats, loginResponseJSON.key, loginResponseJSON.location, eventsParsed)
          
        } else {
          this.setState({
            username: '',
            password: '',
            error: true
          })
        }
      } else {
        const loginResponse = await fetch(apiURL + 'api/login', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        //parses response data to useable objects
        const loginResponseJSON = await loginResponse.json()
        if(loginResponseJSON.status === 200) {
          this.setState({
            test: true,
            password: ''
          })

        } else {
          this.setState({
            username: '',
            password: '',
            error: true
          })
        }
      }


    } catch(err) {
      console.log(err, 'Error with login in splash container')
    }
  }

  handleTestSubmit = async (e) => {
    e.preventDefault()
    try {
      const loginResponse = await fetch(apiURL + 'api/auth', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        //parses response data to useable objects
        const loginResponseJSON = await loginResponse.json()

        if(loginResponseJSON.status === 200) {

          const loginCategories = await JSON.parse(loginResponseJSON.categories)
          const events = await JSON.parse(loginResponseJSON.events)

          let eventsSorted = []
          if(events.length > 1) {
            eventsSorted = events.sort((a, b) => {
              return a.fields.date - b.fields.date
            })
          } else {
            eventsSorted = events
          }

          const eventsParsed = []
          for(let i = 0; i < eventsSorted.length; i++) {
            eventsParsed.push(eventsSorted[i].fields)
          }

          const userCats = []
          //gets category names from response data
          for(let i = 0; i < loginCategories.length; i++) {
            userCats.push(loginCategories[i].fields.name)
          }  
          this.props.login(loginResponseJSON.userid, userCats, loginResponseJSON.key, loginResponseJSON.location, eventsParsed)
          
        } else {
          this.setState({
            username: '',
            password: '',
            error: true
          })
        }

    } catch(err) {
      console.log(err, 'error with handleTestSubmit')
    }
  }

  //change login input fields
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  render(){
    if(this.props.loggedIn === false && this.state.test === false ){
      return(
        <div className='splashContainer'>
          <div className='splash'>
            <ul>
              <li><Link to='/register'>Register</Link></li>
              <li><Link to='/categories'>Skip Login</Link></li>
            </ul>

            <div className="login">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor='usernameinput'>
                  Username:
                </label>
                <br />
                <input id='usernameinput' className='input' name='username' placeholder='Username' onChange={this.handleChange} />
                <br />
                
                <label>
                  Password:
                </label>
                <br />

                <input className='input' name='password' type='password' placeholder='Password' onChange={this.handleChange} />
                <br />
              
                <button>Submit</button>
              </form>
              {this.state.error ? <h3>Incorrect Username or Password</h3> : null}
            </div>

          </div> 
        </div>
      )
    } else if(this.state.test === true) {
      return(
        <div className='splashContainer'>
          <div className='splash'>
            <div className='login'>
              <form onSubmit={this.handleTestSubmit}>
                <label>
                  Please Enter the Auth Token Sent To Your Phone:
                </label>
                <br />
                <input id='usernameinput' className='input' name='authToken' placeholder='Auth Token' onChange={this.handleChange} />
                <button>Submit</button>
              </form>

            </div>
          </div>
        </div>

      )
    }


    else {
      return <Redirect to={'/categories'} />
    }
  }
}     


export default SplashContainer;

