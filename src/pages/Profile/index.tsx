import Avatar from 'components/Avatar';
import Layout from 'components/Layout';
import { authSelector } from 'features/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAppDispatch, useAppSelector, useIsMounted } from 'hooks';
import { db } from 'lib/firebase';
import React, { useEffect, useState } from 'react';
import { AiOutlineAppstore, AiOutlineCamera } from 'react-icons/ai';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { getOnlyOneUser } from 'services';
import { IPost, IUser } from 'shared';

const Profile = () => {
   const { username } = useParams();
   const { user: currentUser } = useAppSelector(authSelector);
   const [user, setUser] = useState<IUser | null>(null);
   const [posts, setPosts] = useState<IPost[]>([]);
   const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
   const [loadingUser, setLoadingUser] = useState<boolean>(true);
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const isMounted = useIsMounted();

   useEffect(() => {
      if (username) {
         setLoadingUser(true);
         getOnlyOneUser('username', username)
            .then((value) => {
               if (value) {
                  setUser(value);
               } else {
                  setUser(null);
               }
               setLoadingUser(false);
            })
            .catch((reason) => console.log(reason));
      }
   }, [username, dispatch]);

   useEffect(() => {
      if (username) {
         setLoadingPosts(true);
         const q = query(
            collection(db, 'posts'),
            where('_user._username', '==', username)
         );
         onSnapshot(q, (querySnapshot) => {
            const posts = querySnapshot.docs
               .map((doc) => {
                  return {
                     ...(doc.data() as IPost),
                     docId: doc.id,
                  };
               })
               .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            if (isMounted()) {
               setPosts(posts);
               setLoadingPosts(false);
            }
         });
      }
   }, [username, dispatch, isMounted]);

   return (
      <Layout>
         <div className="py-6 text-text-color-black">
            <div className="flex mb-11 md:flex-row flex-col items-center md:gap-y-0 gap-y-4 ">
               <div className="w-72 flex items-center justify-center">
                  {loadingUser ? (
                     <Skeleton circle className="  md:w-36 md:h-36 w-20 h-20" />
                  ) : (
                     <Avatar
                        src={user?.avatar as string}
                        alt=""
                        className="  md:w-36 md:h-36 w-20 h-20"
                     />
                  )}
               </div>
               <div className="flex flex-col gap-y-4">
                  <div className="flex items-center md:justify-start justify-center">
                     {loadingUser ? (
                        <Skeleton className="h-6 w-32" />
                     ) : (
                        <h1 className="text-3xl text-center md:text-left">
                           {user?.username}
                        </h1>
                     )}
                     {user?.userId !== currentUser?.userId && <button></button>}
                  </div>
                  <div className="flex items-center gap-x-10">
                     {loadingPosts ? (
                        <>
                           <Skeleton className="w-12 h-5" />
                           <Skeleton className="w-12 h-5" />
                           <Skeleton className="w-12 h-5" />
                        </>
                     ) : (
                        <>
                           <div className="flex items-center gap-x-1">
                              <span className="font-medium">
                                 {posts.length}
                              </span>
                              <span>Posts</span>
                           </div>
                           <div className="flex items-center gap-x-1">
                              <span className="font-medium">
                                 {user?.followers.length}
                              </span>
                              <span>Followers</span>
                           </div>
                           <div className="flex items-center gap-x-1">
                              <span className="font-medium">
                                 {user?.following.length}
                              </span>
                              <span>Following</span>
                           </div>
                        </>
                     )}
                  </div>
                  {loadingUser ? (
                     <div className="flex justify-center md:justify-start">
                        <Skeleton className="h-7 w-36 " />
                     </div>
                  ) : (
                     <h4 className="font-medium text-xl text-center md:text-left">
                        {user?.fullName}
                     </h4>
                  )}
                  {loadingUser ? (
                     <div>
                        <Skeleton className="h-[14px] w-64" />
                        <Skeleton className="h-[14px] w-64" />
                     </div>
                  ) : (
                     user?.description.trim().length !== 0 && (
                        <p className="text-center md:text-left">
                           {user?.description}
                        </p>
                     )
                  )}
               </div>
            </div>
            <div>
               <div className="w-full flex items-center justify-center h-14 border-t border-solid border-gray-300">
                  <button className="flex items-center gap-x-1 h-full">
                     <AiOutlineAppstore className="w-6 h-6" />
                     <span className="uppercase font-medium text-text-color-black">
                        Posts
                     </span>
                  </button>
               </div>
               {loadingPosts ? (
                  <div className="grid md:grid-cols-3 grid-cols-2 md:gap-7 gap-4">
                     {[...new Array(3)].map((item, index) => (
                        <div className="aspect-square" key={index}>
                           <Skeleton className="w-full h-full" />
                        </div>
                     ))}
                  </div>
               ) : (
                  <>
                     {posts.length === 0 &&
                     user?.userId === currentUser?.userId ? (
                        <div className="flex items-center justify-center flex-col py-16 px-4 gap-y-3 text-center">
                           <AiOutlineCamera className="w-16 h-16" />
                           <h2 className="font-medium">Share Photos</h2>
                           <p className="font-medium">
                              When you share photos, they will appear on your
                              profile.
                           </p>
                        </div>
                     ) : posts.length === 0 &&
                       user?.userId !== currentUser?.userId ? (
                        <div className="flex items-center justify-center flex-col py-16 px-4 gap-y-3">
                           <AiOutlineCamera className="w-16 h-16" />
                           <h2 className="font-medium">No Posts Yet</h2>
                        </div>
                     ) : null}
                     {posts.length > 0 && !loadingPosts && (
                        <div className=" grid md:grid-cols-3 grid-cols-2 md:gap-7 gap-4">
                           {posts.map((post) => (
                              <div
                                 key={post.postId}
                                 onClick={() => {
                                    navigate(`/p/${post.docId}`);
                                 }}
                                 className="cursor-pointer"
                              >
                                 <div className="aspect-square">
                                    <img
                                       src={post._image}
                                       alt=""
                                       className="w-full object-cover h-full "
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>
      </Layout>
   );
};

export default Profile;
