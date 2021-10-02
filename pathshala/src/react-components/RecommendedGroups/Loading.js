import React from 'react'

import {CircularProgress,Typography} from '@material-ui/core';


export default function Loading() {
  return (
    <React.Fragment>
      <div className="container mt-5">
        <div className="row mt-5">
          <div className="col-12 text-center mt-5">
            <Typography variant='h3' gutterBottom>
              Loading 
            </Typography>
            <CircularProgress />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
