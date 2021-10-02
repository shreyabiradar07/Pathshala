import { Button, List, ListItem, ListItemText } from "@material-ui/core";

import React, { useState } from "react";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import "./Resources.css";

export default function Resource1() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        Resource 1
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Resource 1</h2>
  
            <LinkPreview url="https://youtu.be/4iFALQ1ACdA" width="400px" />
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
<div> <a style= {{ width:"135px" ,backgroundColor: "#1065b7", textAlign: "center", fontWeight: "800", padding: "9px 0px", color: "white", fontSize: "10px", display: "inline-block", textDecoration: "none"}} href='https://pmny.in/Tr069EmYrX9o' > Pay Now </a> </div>
            <span>OR </span> <span>
            <div> <a style= {{ width:"135px" ,backgroundColor: "#1065b7", textAlign: "center", fontWeight: "800", padding: "9px 0px", color: "white", fontSize: "10px", display: "inline-block", textDecoration: "none"}} href='#' > Redeem Points </a> </div>
            </span>
</div>
            <button
              className="close-modal"
              onClick={toggleModal}
              
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
