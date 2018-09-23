import React, {Component} from 'react';
import DeleteEvent from '../DeleteEvent';
import {Route, Switch} from 'react-router-dom';

const apiURL = 'http://localhost:8000/';
// const apiURL = 'https://ancient-springs-75165.herokuapp.com/'


class YourEventsContainer extends Component {
  constructor(){
    super();
  }
  render(){
    return (
      <div className='eventContainer'>
        {this.props.userEvents.map((event, i) => {
          return <DeleteEvent key={i} deleteEvent={this.props.deleteEvent} eventInfo={event.fields}/>
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


