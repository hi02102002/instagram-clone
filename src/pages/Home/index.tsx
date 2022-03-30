import Layout from 'components/Layout';
import { authSelector } from 'features/auth';
import { postsSelector, subscribePosts } from 'features/posts';
import { deleteDoc, doc } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks';
import { db } from 'lib/firebase';
import React, { useEffect } from 'react';
import Post from './components/Post';
import Sidebar from './components/Sidebar';

const Home = () => {
   const dispatch = useAppDispatch();
   const { user } = useAppSelector(authSelector);
   const { posts: dataPosts } = useAppSelector(postsSelector);

   const removePost = async (postId: string, docId: string) => {
      await deleteDoc(doc(db, 'posts', docId));
   };
   useEffect(() => {
      dispatch(subscribePosts(user?.userId as string));
   }, [user?.userId, dispatch]);

   return (
      <Layout>
         <div className="mt-6">
            <main className="flex gap-x-7">
               <section className="w-full max-w-[37.5rem] flex flex-col gap-y-6">
                  {/* {loading
                     ? [...new Array(3)].map((item, index) => (
                          <SkeletonPost key={index} />
                       ))
                     : dataPosts.map((post) => (
                          <Post
                             key={post.postId}
                             post={post}
                             onRemove={removePost}
                          />
                       ))} */}
                  {dataPosts.map((post) => (
                     <Post
                        key={post.postId}
                        post={post}
                        onRemove={removePost}
                     />
                  ))}
                  {dataPosts.length === 0 && (
                     <p className="text-xl text-center text-text-color-black">
                        Following user to see post.
                     </p>
                  )}
               </section>
               <Sidebar />
            </main>
         </div>
      </Layout>
   );
};

export default React.memo(Home);
