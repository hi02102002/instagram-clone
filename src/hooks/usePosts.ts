import { PostsContext } from 'context/post.contenxt';
import { useContext } from 'react';

export const usePosts = () => useContext(PostsContext);
