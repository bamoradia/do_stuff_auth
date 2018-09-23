import React, {Component} from 'react';
import Events from '../Events';
import {Route, Switch} from 'react-router-dom';

const apiURL = 'http://localhost:8000/';
// const apiURL = 'https://ancient-springs-75165.herokuapp.com/'


class YourEventsContainer extends Component {
  constructor(){
    super();
  }


  // componentDidMount() {
  //   const eventsSorted = this.props.userEvents.sort((a, b) => {
  //     return a.fields.date - b.fields.date
  //   })

  //   this.setState({
  //     events: eventsSorted
  //   })
  // }

  //adds events to user in backend serer
  addEvent = async (event, e) => {
    e.preventDefault();
    try {
      const events = await fetch(apiURL + 'api/addevent', { // Possibly incorrect api call
        method: 'POST',
        body: JSON.stringify(event),
        headers: {
          'Content-Type': 'application/json'
        }
      });


      const parsedResponse = await events.json();
      this.setState({events: [...this.state.events, parsedResponse.data]})
    } catch(err){
      console.log(err);
    }
  }

  //deletes the event from the user database
  deleteEvent = async (id, e) => {
    e.preventDefault();
    console.log('deleteEvent function is being called, this is the id: ', id);
    try {
      const deleteEvent = await fetch(apiURL + 'api/deleteevent' + id, {
        method: 'DELETE'
      });

      const parsedResponse = await deleteEvent.json();

      this.setState({events: this.state.events.filter((event, i) => event._id !== id)});
    } catch(err) {
      console.log(err);
    }
  }


  render(){
    console.log(this.props.userEvents)
    return (
      <div className='eventContainer'>
        {this.props.userEvents.map((event, i) => {
          return <Events key={i} addEvent={this.props.addEvent} eventInfo={event.fields}/>
        })}
      </div>
    )
  }
}


export default YourEventsContainer;



    // <div>
      // <Events
        // events={this.state.events}
        // deleteEvent={this.deleteEvent}
        // showModal={this.showModal}
      // />
    // </div>


