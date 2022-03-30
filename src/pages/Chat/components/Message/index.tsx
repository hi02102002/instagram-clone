import React from 'react';
import { IMessage, IMessageType } from 'shared';
import './Message.css';
interface Props {
   message: IMessage;
   isRight: boolean;
}
const Message: React.FC<Props> = ({ message, isRight }) => {
   return (
      <div className="flex ">
         <div
            className={`message-wrap ${isRight ? 'isRight' : ''}`}
            title={message._sender._username}
         >
            {message._type === IMessageType.TEXT && (
               <div className="message-content">{message._message}</div>
            )}
            {message._type === IMessageType.IMG_ICON && (
               <img src={message._message} alt="" className="w-7 h-7" />
            )}
            {message._type === IMessageType.IMG && (
               <img
                  src={message._message}
                  alt=""
                  className="max-w-xs rounded"
               />
            )}
         </div>
      </div>
   );
};

export default Message;
