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
            <LinkPreview url="https://youtu.be/B7iYJT_ll-U" width="400px" />

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
