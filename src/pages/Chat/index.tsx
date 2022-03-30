import Layout from 'components/Layout';
import { authSelector } from 'features/auth';
import { subscribeConversations } from 'features/conversations/conversationActions';
import { useAppDispatch, useAppSelector } from 'hooks';
import React, { useEffect } from 'react';
import ChatView from './components/ChatView';
import Sidebar from './components/Sidebar';

const Chat = () => {
   const { user } = useAppSelector(authSelector);

   const dispatch = useAppDispatch();

   useEffect(() => {
      if (user?.userId && user.username) {
         dispatch(subscribeConversations(user.userId, user.username));
      }
   }, [user, dispatch]);

   return (
      <Layout>
         <div className="flex  w-full my-6 h-[calc(100vh_-_(var(--header-height)_+_2_*_24px))]">
            <div className="flex w-full bg-white rounded border border-solid border-border-color">
               <div className="w-[350px] flex-shrink-0">
                  <Sidebar />
               </div>
               <div className="flex-1 w-full">
                  <ChatView />
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default Chat;
