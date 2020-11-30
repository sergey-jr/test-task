import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Button, Container, List, ListItem, Modal} from '@material-ui/core';
import Comment from "./Comment";
import EmptyForm from "./EmptyForm";

const API_URL = "http://127.0.0.1:8000/api/comments/"

const CommentList = () => {
    const [comments, setComments] = useState([])
    const [open, setOpen] = React.useState(false)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        axios.get(API_URL).then((data) => {
            let commentsList = data.data.data
            setComments(commentsList)
        }).catch((error) => {
            console.log(error)
        })
    }, []);

    return (
        <Container maxWidth="md">
            <List>
                {comments.map(comment => {
                    return (
                        comments !== undefined &&
                        <ListItem key={comment.id} style={{marginLeft: 40 * comment.level + 'px'}}>
                            <Comment key={comment.id} comment={comment}/>
                        </ListItem>
                    )
                })}
            </List>
            <Button onClick={handleOpen}>
                Leave comment
            </Button>
            <Modal
                open={open}
                id="newComment"
            >
                <EmptyForm handleClose={handleClose}/>
            </Modal>
        </Container>
    )
}

export default CommentList
