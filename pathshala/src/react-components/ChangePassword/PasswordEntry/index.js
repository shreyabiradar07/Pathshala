import React from 'react';

import './PasswordEntry.css';

import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

/* Component to show a TextField with hide/show password capabilities */
class PasswordEntry extends React.Component {
  render() {
    const { label, value, showPsw, toggleShowPsw, onChange } = this.props
    return (
      <div className="field">
        <TextField 
          label={ label }
          variant="outlined"
          type={ showPsw ? "text" : "password" }
          fullWidth={ true }
          onChange={ onChange }
          value={ value }
          InputProps={{ endAdornment: 
            <InputAdornment position="end">
              <IconButton
                onClick={ toggleShowPsw }
                edge="end"
              >
                { showPsw ? <Visibility /> : <VisibilityOff /> }
              </IconButton>
            </InputAdornment> 
          }}
        />
      </div>
    )
  }
}

export default PasswordEntry;