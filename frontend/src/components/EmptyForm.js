import React, {useState} from "react";
import {Button, TextField} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/comments/"

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    closeButton: {
        float: "right"
    }
}));

const EmptyForm = (props) => {
    const {parent, comment, handleClose} = props
    let {id, created_at, updated_at, creator, text, children} = comment === undefined ? {
        id: 0,
        created_at: 0,
        updated_at: 0,
        creator: "",
        text: "",
        children: 0
    } : comment
    const [message, setMessage] = useState(text)
    const [user, setUser] = useState(creator)
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles()

    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleChangeUser = (e) => {
        setUser(e.target.value)
    }

    const leaveComment = () => {
        if (comment === undefined) {
            axios.post(API_URL, {
                data: {
                    text: message
                },
                user: user,
                parent: parent !== undefined ? parent : null
                })
                .then(
                    document.location.reload()
                )
        } else {
            axios.put(API_URL + id, {
                data: {
                    text: message
                }
                })
                .then(() => {
                        document.location.reload();
                    }
                )
        }
    }

    return (
        <div style={modalStyle} className={classes.paper}>
            <Button onClick={handleClose} className={classes.closeButton}>X</Button>
            <div>
                <TextField id="user" variant={"outlined"} label="Username"
                           value={typeof (user) === "object" ? user.username : user}
                           onChange={handleChangeUser} InputProps={{readOnly: comment !== undefined,}}/>
                <TextField id="comment" label="Comment" multiline fullWidth={true} variant="outlined"
                           value={message}
                           onChange={handleChangeMessage}/>
            </div>
            <Button onClick={leaveComment}>Leave comment</Button>
        </div>
    )
}

export default EmptyForm