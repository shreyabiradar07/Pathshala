import React from "react";
import { uid } from "react-uid";

import "./styles.css";

import { TextField, MenuItem, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

/* Component for the Filter in the RightSideBar */
class FilterEntry extends React.Component {
  state = {
    value: ""
  }

  // Update state.value when TextFields are changed
  onChange = e => {
    const { value } = e.target;
    this.setState({
      value: value
    })
  };

  render() {
    const { entry, addSelection, onEventsPage, eventAction } = this.props
    const { title, isDropdown, options, applied } = entry;
    
    return (
      <div className="filter-entry-div">
        <div className="entry-details">
          <div className="entry-title">{ title + ":"}</div>
          {/* Depending on if the entry-type is dropdown or not, render a different element */}
          { isDropdown ? (
            <div className="entry-field">
              <TextField 
              select={true}
              fullWidth={true}
              label="Select"
              variant="outlined"
              color="secondary"
              size="small" 
              disabled={ eventAction }
              value={this.state.value}
              onChange={this.onChange}
              SelectProps={{
                autoWidth: true,
              }}
              >
                {options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
                ))}
              </TextField>  
            </div>
          ) : (
            <TextField 
              label="Enter"
              variant="outlined"
              color="secondary"
              size="small" 
              disabled={ eventAction }
              onChange={this.onChange}
              value={this.state.value}
            />
          )}

          <IconButton 
            className="add-entry-button" 
            size="medium"
            edge="end"
            color="secondary"
            disabled={ eventAction }
            onClick={() => (addSelection(onEventsPage, title, this.state.value))}>
            <AddCircleIcon/>
          </IconButton>
        </div>

        <div className="applied-filters">
          {applied.map(value => (
            <span key={ uid(value) } className="applied-value">{ value }</span>
          ))}
        </div>
      </div>
    );
  }
}

export default FilterEntry;