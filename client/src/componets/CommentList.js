import React from 'react';
import { Box } from '@mui/material';
import CommentItem from './CommentItem';

const CommentList = ({ comments, onCommentDeleted, onCommentUpdated }) => {
  return (
    <Box>
      {comments.map((comment, index) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onCommentDeleted={onCommentDeleted}
          onCommentUpdated={onCommentUpdated}
          isLast={index === comments.length - 1}
        />
      ))}
    </Box>
  );
};

export default CommentList;
