import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { NoResults } from '../NoResults';

export function MessagesList({ messages, existingData }) {
  const chatContainerRef = useRef(undefined);

  useEffect(() => {
    // TODO: If user is scrolling the conversation, display a notification and an arrow icon to go to the last message
    // * Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      // * Delay to let files load
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 500);
    }
  }, [messages]);

  return (
    <div
      id='messages-list-container'
      className='relative flex flex-col flex-grow'
    >
      <div
        ref={chatContainerRef}
        className='absolute bottom-2 inset-0 overflow-y-scroll overflow-x-hidden p-8'
      >
        {messages.length > 0 ?
          <ul className='flex flex-col'>
            {messages?.map(message =>
              <Message key={message.id} message={message} />
            )}
          </ul>
          :
          <NoResults existingData={existingData} noDataMessage={'This is the beginning of your epic conversation!'} />
        }
      </div>
    </div>
  )
}