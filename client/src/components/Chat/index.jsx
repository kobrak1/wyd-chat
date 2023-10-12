import { MessagesList } from './MessagesList';
import { ChatInput } from './ChatInput';
import { useSelector } from 'react-redux';
import { ChatHeader } from './ChatHeader';
import { useSidebarContext } from '../../hooks/useSidebarContext';
import clsx from 'clsx';
import { useSearch } from '../../hooks/useSearch';
import { useState } from 'react';

export function Chat() {
  const [showSearchChat, setShowSearchChat] = useState(false)

  const { sidebarOpen } = useSidebarContext()
  const activeChat = useSelector((state) => state.userChats).data.activeChat

  const {
    filteredData,
    searchInput,
    chatInputRef,
    clearSearchValue
  } = useSearch({ data: activeChat.messages, searchKey: 'text' })

  function handleShowSearchChat() {
    // * If the value is false when called it means that we are opening the search bar
    if (!showSearchChat) {
      // * We use a small delay to avoid the button stealing the focus away when clicked
      setTimeout(() => {
        chatInputRef.current.focus()
      }, 50);
    }

    setShowSearchChat(showingChat => {
      if (showingChat) {
        clearSearchValue()
        return !showingChat
      }
      return !showingChat
    })
  }

  return (
    <div className={clsx('flex flex-1 flex-col blur-overlay', sidebarOpen && 'hidden md:flex')}>
      <ChatHeader activeChat={activeChat} handleShowSearchChat={handleShowSearchChat} />
      <div id='chat-search-container' className={clsx(!showSearchChat && 'hidden', 'w-full p-2')} >
        {searchInput}
      </div>
      <div
        id='chat-container'
        className='flex flex-col flex-grow'
      >
        {activeChat?.messages &&
          <>
            <MessagesList messages={filteredData} existingData={activeChat.messages.length > 0} />
            <ChatInput />
          </>
        }
      </div>
    </div>
  );
}
