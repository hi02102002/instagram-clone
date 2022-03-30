import Avatar from 'components/Avatar';
import ModalConfirm from 'components/ModalConfirm';
import Spiner from 'components/Spiner';
import { authSelector } from 'features/auth';
import {
   conversationSelector,
   selectConversation,
} from 'features/conversations';
import {
   arrayUnion,
   collection,
   doc,
   limit,
   onSnapshot,
   orderBy,
   query,
   Unsubscribe,
   updateDoc,
} from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks';
import { IMAGES } from 'images';
import { db } from 'lib/firebase';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { GrSend } from 'react-icons/gr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useParams } from 'react-router-dom';
import { getConversation } from 'services/getConversation';
import { IMessage } from 'shared';
import { getConversationName } from 'utils';
import InputMessage from '../InputMessage';
import Message from '../Message';
import ModalInformation from '../ModalInformation';

const LIMITED_CHAT = 20;

const ChatView = () => {
   const { conversationId } = useParams();
   const { user } = useAppSelector(authSelector);
   const { currentConversation } = useAppSelector(conversationSelector);
   const [messages, setMessages] = useState<IMessage[]>([]);
   const [hasMore, setHasMore] = useState<boolean>(false);
   const [count, setCount] = useState<number>(LIMITED_CHAT);
   const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
   const [showModalInformation, setShowModalInformation] =
      useState<boolean>(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const removeHandle = async () => {
      navigate('/chat', {
         replace: true,
      });
      updateDoc(
         doc(
            db,
            'conversations',
            currentConversation?._conversationDocId as string
         ),
         {
            _userDeleted: arrayUnion(user?.userId as string),
         }
      );
      setShowModalConfirm(false);
      setShowModalInformation(false);
      dispatch(selectConversation(null));
   };

   useEffect(() => {
      let unsubscribe: Unsubscribe;
      if (conversationId) {
         const first = query(
            collection(db, `conversations/${conversationId}/messages`),
            limit(count),
            orderBy('_createAt', 'desc')
         );
         unsubscribe = onSnapshot(first, (querySnapShot) => {
            const _messages = querySnapShot.docs.map((doc) => {
               return {
                  ...doc.data(),
                  _docId: doc.id,
               } as IMessage;
            });
            if (_messages.length >= count) {
               setHasMore(true);
            } else {
               setHasMore(false);
            }
            setMessages(_messages);
         });
      }
      return () => {
         if (unsubscribe) {
            unsubscribe();
         }
      };
   }, [conversationId, count]);

   useEffect(() => {
      if (conversationId) {
         getConversation(conversationId)
            .then((value) => {
               if (value) {
                  dispatch(selectConversation(value));
               }
            })
            .catch((reject) => {
               console.log(reject);
            });
      }
   }, [conversationId, dispatch]);

   useEffect(() => {
      setCount(LIMITED_CHAT);
   }, [currentConversation]);

   return (
      <div className=" flex flex-col h-full animate-fadeIn">
         {!currentConversation ? (
            <div className="flex items-center justify-center h-full flex-col">
               <GrSend className="h-24 w-24" />
               <h2>Your message</h2>
               <p>Send private photos and messages to a friend or group.</p>
               <button></button>
            </div>
         ) : (
            <>
               <div className="h-header-height flex items-center justify-between px-6 border-solid border-b border-border-color flex-shrink-0">
                  <div className="flex items-center gap-x-3 ">
                     <Avatar src={IMAGES.noAvatar} alt="" />
                     <h4 className="font-medium text-text-color-black max-w-[200px] line-clamp-1">
                        {currentConversation &&
                           user &&
                           getConversationName(
                              currentConversation._member,
                              user.username
                           )}
                     </h4>
                  </div>
                  <button onClick={() => setShowModalInformation(true)}>
                     <AiOutlineInfoCircle className="w-6 h-6 text-text-color-black" />
                  </button>
               </div>
               <div className="flex-1 ">
                  <div
                     id="scrollableDiv"
                     style={{
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                     }}
                     className="px-6 max-h-[calc(100vh_-_(var(--header-height)_+_24px)_-_2_*_60px_-_2_*_1.5rem)] h-full p-6"
                  >
                     <div className="hidden" ref={messagesEndRef}></div>
                     <InfiniteScroll
                        dataLength={messages.length}
                        hasMore={hasMore}
                        next={() => {
                           setCount(count + LIMITED_CHAT);
                        }}
                        loader={
                           <div className="flex items-center justify-center">
                              <Spiner />
                           </div>
                        }
                        style={{
                           display: 'flex',
                           flexDirection: 'column-reverse',
                           rowGap: '12px',
                           overflow: 'unset',
                        }}
                        inverse={true} //
                        scrollableTarget="scrollableDiv"
                     >
                        {messages.map((_msg) => (
                           <Message
                              key={_msg._docId}
                              message={_msg}
                              isRight={_msg._sender._id === user?.userId}
                           />
                        ))}
                     </InfiniteScroll>
                  </div>
               </div>
               <InputMessage />
            </>
         )}
         {showModalConfirm && (
            <ModalConfirm
               onClose={() => setShowModalConfirm(false)}
               title="You want remove this conversation?"
               textButtonConfirm="Remove"
               onRemove={removeHandle}
            />
         )}
         {showModalInformation && (
            <ModalInformation
               members={currentConversation?._member as any}
               onClose={() => {
                  if (showModalConfirm) {
                     return;
                  }
                  setShowModalInformation(false);
               }}
               onRemove={() => setShowModalConfirm(true)}
            />
         )}
      </div>
   );
};

export default React.memo(ChatView);
