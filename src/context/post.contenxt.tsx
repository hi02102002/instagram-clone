import { authSelector } from 'features/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAppSelector } from 'hooks';
import { db } from 'lib/firebase';
import { createContext, useEffect, useState } from 'react';
import { getOnlyOneUser } from 'services';
import { IPost } from 'shared';

interface IPostsContext {
   posts: IPost[];
   setPosts: any;
   loading: boolean;
}

const defaultState: IPostsContext = {
   posts: [],
   setPosts: (value: any) => {},
   loading: false,
};

export const PostsContext = createContext<IPostsContext>(defaultState);

const PostsProvider: React.FC = ({ children }) => {
   const [posts, setPosts] = useState<IPost[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const { user } = useAppSelector(authSelector);

   useEffect(() => {
      const getAllPostsUserFollowing = async () => {
         try {
            setLoading(true);
            const following = (
               await getOnlyOneUser('userId', user?.userId as string)
            )?.following as string[];
            if (following?.length > 0) {
               const q = query(
                  collection(db, 'posts'),
                  where('_userId', 'in', following)
               );

               const querySnapshot = await getDocs(q);
               const data = querySnapshot.docs.map((doc) => {
                  return {
                     ...doc.data(),
                     docId: doc.id,
                  };
               }) as IPost[];

               setPosts(data);
               setLoading(false);
            } else {
               setPosts([]);
               setLoading(false);
            }
         } catch (error) {
            console.log(error);
            setLoading(false);
         }
      };
      getAllPostsUserFollowing();
   }, [user]);

   const value = {
      posts,
      loading,
      setPosts,
   };

   return (
      <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
   );
};

export default PostsProvider;
