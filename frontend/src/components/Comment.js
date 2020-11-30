import React, {useState} from "react";
import {Button, List, ListItem, makeStyles, Modal, Paper} from "@material-ui/core";
import axios from 'axios'
import EmptyForm from "./EmptyForm";

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
    bold: {
        fontWeight: "bold"
    },
    tiny: {
        color: "lightgrey"
    },
    primary: {
        color: "blue",
        border: "1px solid black"
    },
    danger: {
        color: "red",
        border: "1px solid black"
    },
    edit: {
        color: "grey",
        border: "1px solid black"
    },
    danger_text: {
        color: 'red'
    },
    flex: {
        display: "flex",
        textAlign: "center",
        alignItems: "center"
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

const parseDate = (dateString) => {
    let date = new Date(dateString)
    return pad(date.getDate()) + "." + pad(date.getMonth()) + "." + date.getFullYear() + " "
        + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}

const Comment = (props) => {
    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle);
    let {comment} = props
    let {id, created_at, updated_at, creator, text, children} = comment
    created_at = parseDate(created_at)
    updated_at = parseDate(updated_at)

    const [openEdit, setOpenEdit] = useState(false)
    const [openReply, setOpenReply] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const handleReplyOpen = () => {
        setOpenReply(true)
    }

    const handleReplyClose = () => {
        setOpenReply(false)
    }

    const handleEditOpen = () => {
        setOpenEdit(true)
    }

    const handleEditClose = () => {
        setOpenEdit(false)
    }

    const handleDeleteOpen = () => {
        setOpenDelete(true)
    }

    const handleDeleteClose = () => {
        setOpenDelete(false)
    }

    const handleDelete = () => {
        axios.delete(API_URL + id)
            .then((result) => {
                document.location.reload()
            })
            .catch((error) => {
                if (error.response && error.response.status === 409) {
                    alert("This comment cannot be deleted")
                    handleDeleteClose()
                }
            })
    }

    return (
        <div key={id}>
            <div>
                <span className={classes.bold} key={creator}>{creator}</span>
                <span className={classes.tiny}> at {created_at}</span>
                {updated_at !== created_at && <span className={classes.tiny}> (edited at {updated_at})</span>}
            </div>
            <div>
                {text}
            </div>
            <div>
                <Button className={classes.edit} onClick={handleEditOpen}>Edit</Button>
                {
                    comment.level < 3 &&
                    <Button className={classes.primary} onClick={handleReplyOpen}>Reply</Button>
                }
                <Button className={classes.danger} onClick={handleDeleteOpen}>Delete</Button>
            </div>
            <List>
                {children.map(comment => {
                    return (
                        comment !== undefined && typeof (comment) !== "number" &&
                        <ListItem key={comment.id}>
                            <Comment key={comment.id} comment={comment}/>
                        </ListItem>
                    )
                })}
            </List>
            <Modal open={openEdit}
                   id="edit"
            >
                <EmptyForm handleClose={handleEditClose} comment={comment}/>
            </Modal>
            <Modal
                open={openReply}
                id="reply"
            >
                <EmptyForm handleClose={handleReplyClose} parent={id}/>
            </Modal>
            <Modal
                open={openDelete}
                id="delete"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className={classes.danger_text}>ARE YOU SURE TO DELETE?</div>
                    <div className={classes.flex}>
                        <Button className={classes.danger} onClick={handleDelete}>Yes</Button>
                        <Button className={classes.primary} onClick={handleDeleteClose}>No</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Comment