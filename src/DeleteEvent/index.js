import React, { Component } from 'react';


class DeleteEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	//purpose is to change color of next active method to green
  placeholderMethod = () => {
  }

  handleClick = async (e) => {
  	e.preventDefault();
  	this.props.deleteEvent(e.currentTarget.id)
  }

	render() {
		//this returns a component that shows information about the event
	  return (
	  	<div>
		    <a className='events' target='_blank' href={this.props.eventInfo.url}>
		    <img  className='eventImg' src={this.props.eventInfo.image_url} alt={this.props.eventInfo.name}/>
		     <div> <h4>{this.props.eventInfo.name}</h4></div></a><br/>
		    <button id={this.props.eventInfo.url} onClick={this.handleClick}>Delete from your Events</button>
	    </div>
	    
	  )
	 }

}

export default DeleteEvent;