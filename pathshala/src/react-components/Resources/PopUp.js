import React from "react";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import {
  Grid,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: "25px",
    flexGrow: "1",
    alignSelf: "center",
    fontWeight: "bold",
    textAlign: "center",
  },
  scoreCard: {
    border: "1px solid black",
    width: "50%",
    margin: "10px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "18px",
    borderRadius: "10px",
    backgroundColor: "white",
  },
  score: {
    color: "#0f4d85",
  },
  skillsGrid: {
    border: "1px solid",
    padding: "10px",
    textAlign: "center",
    margin: "10px auto",
  },
  linearProgress: {
    width: "85%",
    margin: "5px auto",
  },
}));

const PopUp = (props) => {
  const { openPopup, setOpenPopup } = props;
  const classes = useStyles();
  return (
    <div>
      <Dialog open={openPopup} maxWidth="sm" fullWidth>
        <DialogTitle style={{ padding: "8px 24px" }}>
          <div style={{ display: "flex" }}>
            <Typography className={classes.title}>Resource 1 </Typography>
            <LinkPreview
              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              width="400px"
            />
            
            <IconButton
              onClick={() => {
                setOpenPopup(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
      </Dialog>
    </div>
  );
};

export default PopUp;
