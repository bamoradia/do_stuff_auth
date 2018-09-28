import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import CategoryEventContainer from './CategoryEventContainer'
import { withRouter, Route, Switch } from 'react-router-dom';
import Categories from './Categories';
import SplashContainer from './SplashContainer';
import Register from './Register'
import Logout from './Logout'
import AccountSettings from './AccountSettings'
import YourEventsContainer from './YourEventsContainer'
import Loading from './Loading'

// const apiURL = 'http://localhost:8000/';
// const apiURL = 'https://ancient-springs-75165.herokuapp.com/'
const apiURL = 'https://afternoon-hollows-80618.herokuapp.com/'

class App extends Component {
  constructor() {
    super();
    this.state = {
      //all categories are stored here
      categories: [],
      //user specific categories saved here
      userCategories: [],
      //information about user to be stored here
      userLocation: '',
      //userid saver here
      userId: '',
      //user key to be sent along with all fetch calls
      userKey: '',
      //all events saved here
      allEvents: [],
      //last active page stored here
      activePage: '',
      //events user has saved
      userEvents: [],
      //category that user last picked in home page
      activeCategory: 'other',
      //track status of user login
      loggedIn: false,
      //false until initial data is loaded from backend server
      loaded: false
    }
  }

  //purpose is to change color of next active method to green
  placeholderMethod = () => {
  }

  //called if login was successful
  login = (userId, userCategories, key, location, events) => {
    this.setState({
      loggedIn: true,
      userId: userId, 
      userCategories: userCategories, 
      userKey: key, 
      userLocation: location, 
      userEvents: events
    })
    this.props.history.push('/categories')
  }

  //called if register was successful
  register = (location, userId, key) => {

    this.setState({
      loggedIn: true,
      userLocation: location,
      userId: userId,
      userKey: key
    })
    //
    //  CHANGE TO ACCOUNT SETTINGS PAGE
    //
    this.props.history.push('/settings')
  }

  //called if logout is successful
  logout = (status) => {
    this.setState({
      loggedIn: false,
      userId: '',
      userLocation: '',
      userKey: '',
      userCategories: [],
      userEvents: []
    })
    this.props.history.push('/')
  }

  //make initial call to load data from server
  componentDidMount() {
    this.addInitialData().then(data => {
      this.setState({
        categories: data.categories,
        allEvents: data.events,
        loaded: true
      })
    })
  }

  //called if updateUser call is successful
  updateUser = (location, categories) => {
    this.setState({
      userLocation: location,
      userCategories: categories
    })

    this.props.history.push('/categories')
  }

  //called when user adds/deletes from their saved categories list
  changeUserCategory = (category) => {

    if(this.state.userCategories.indexOf(category) === -1) {
      this.setState({
        userCategories: [...this.state.userCategories, category]
      })
    } else {
        const stateCategories = this.state.userCategories;
        const index = this.state.userCategories.indexOf(category);
        stateCategories.splice(index, 1)

        this.setState({
          userCategories: stateCategories
        })
    }
  }

  //makes original fetch call to API to get updated data
  addInitialData = async () => {
    try {
      const response = await fetch(apiURL + 'api/events');

      const responseJSON = await response.json()
      const eventsJSON = await JSON.parse(responseJSON.data.events)
      const categoryJSON = await JSON.parse(responseJSON.data.categories)

      const filteredEvents = eventsJSON.map(event => {
        return event.fields
      })

      const filteredCategories = categoryJSON.map(category => {
        return category.fields.name
      })

      return {events: filteredEvents, categories: filteredCategories}
    } catch (err) {
      console.log(err, 'error with updateData in App.js')
    }
  }

  //called when user changes the events category they want to view
  changeActiveCategory = (category) => {
    this.setState({
      activeCategory: category
    })
    this.props.history.push('/categoryevent')
  }

  addEvent = async (event) => {
    try {
      if(this.state.loggedIn) {
        const body = JSON.stringify({key: this.state.userKey, userid: this.state.userId, event: event})
        const response = await fetch(apiURL + 'api/addevent', {
          method:'POST',
          credentials: 'include',
          body: body,
          header: {
            'Content-Type': 'application/json'
          }
        })

        const responseJSON = await response.json();
        if(responseJSON.status === 200) {
          for(let i = 0; i < this.state.allEvents.length; i++) {
            if(this.state.allEvents[i].url === event) {
              this.setState({
                userEvents: [...this.state.userEvents, this.state.allEvents[i]]
              })
            }
          }
        } else if(responseJSON.status === 204) {
          //do nothing - event already in database
        } else if(responseJSON.status === 401) {
          //User not authenticated properly
        }
      } else {
        this.props.history.push('/register')
      }
    } catch (err) {
      console.log(err, 'error with add event route')
    }

  }

  deleteEvent = async (event) => {
    try {
      if(this.state.loggedIn) {
        const body = JSON.stringify({key: this.state.userKey, userid: this.state.userId, event: event})
        const response = await fetch(apiURL + 'api/deleteevent', {
          method:'POST',
          credentials: 'include',
          body: body,
          header: {
            'Content-Type': 'application/json'
          }
        })


        const responseJSON = await response.json();
        if(responseJSON.status === 200) {
          const events = this.state.userEvents.filter(events => events.url !== event)
          this.setState({
            userEvents: events
          })
        } else if(responseJSON.status === 204) {
          //do nothing - event not in database
        } else if(responseJSON.status === 401) {
          //User not authenticated properly
        }
      } else {
        this.props.history.push('/register')
      }
    } catch (err) {
      console.log(err, 'error with add event route')
    }

  }

  render() {
    return (
      <main>
        <Header login={this.state.loggedIn}/>
        <Switch>
          
          {this.state.loaded ? 
            <Route exact path='/' render={() => 
              <SplashContainer 
                login={this.login} 
                loggedIn={this.state.loggedIn}/> } 
              /> 
            :
            <Route path='/' render={() => 
              <Loading /> } /> 
          }


          <Route exact path='/categoryevent' render={() => 
            <CategoryEventContainer 
              allEvents={this.state.allEvents} 
              categories={this.state.categories} 
              activeCategory={this.state.activeCategory}
              addEvent={this.addEvent} 
            />}
          />


          <Route exact path='/categories' render={() => 
            <Categories 
              userCategories={this.state.userCategories} 
              categories={this.state.categories} 
              changeActiveCategory={this.changeActiveCategory} 
            />}
          />


          <Route exact path='/register' render={() => 
            <Register 
              register={this.register} 
            /> } 
          />

          <Route exact path='/logout' render={() => 
            <Logout 
              logout={this.logout} 
              loggedIn={this.state.loggedIn} 
              history={this.props.history}
              userId={this.state.userId}
              userKey={this.state.userKey}
            /> } 
          />

          <Route exact path='/settings' render={() => 
            <AccountSettings 
              userId={this.state.userId} 
              loggedIn={this.state.loggedIn} 
              userLocation={this.state.userLocation} 
              userCategories={this.state.userCategories} 
              categories={this.state.categories} 
              changeUserCategory={this.changeUserCategory} 
              updateUser={this.updateUser}
              userKey={this.state.userKey}
            /> } 
          />

          <Route exact path='/yourevents' render={() => 
            <YourEventsContainer 
              userEvents={this.state.userEvents}
              deleteEvent={this.deleteEvent}
            />}
          />
        </Switch>
      </main>
    )
  }
}


export default withRouter(App);
