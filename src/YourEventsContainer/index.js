import React, {Component} from 'react';
import DeleteEvent from '../DeleteEvent';
import {Route, Switch} from 'react-router-dom';


class YourEventsContainer extends Component {
  constructor(){
    super();
  }
  render(){
    console.log(this.props.userEvents)
    return (
      <div className='eventContainer'>
        {this.props.userEvents.map((event, i) => {
          return <DeleteEvent key={i} deleteEvent={this.props.deleteEvent} eventInfo={event}/>
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


