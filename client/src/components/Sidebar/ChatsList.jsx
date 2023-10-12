import { useDispatch, useSelector } from 'react-redux';
import { activateChat } from '../../redux/reducers/userChatsReducer';
import { Contact } from '../Contact';
import { useSidebarContext } from '../../hooks/useSidebarContext';
import { NoResults } from '../NoResults';

export function ChatsList({ filteredChatsData, existingData }) {
  const dispatch = useDispatch()
  const { toggleSidebar } = useSidebarContext()

  const activeChatId = useSelector(state => state.userChats).data?.activeChat?.id
  const { typingUsersById, onlineUsersById } = useSelector(state => state.userContacts)

  function handleSelectChat(chatId) {
    dispatch(activateChat(chatId))
    toggleSidebar(false)
  }

  if (!filteredChatsData) {
    return null
  }

  return (
    <>
      {filteredChatsData.length > 0 ?
        <>
          {filteredChatsData.map((chat) => {
            const lastContactMessage = chat?.messages
              .at(-1)

            return (
              <li
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                id='chat-list-item'
                className='hover:cursor-pointer hover:bg-blueChat-50 hover:rounded-lg mx-1 bg-white'
              >
                <Contact
                  key={chat?.contact?.id}
                  name={chat?.title}
                  avatar={chat?.contact?.avatarPhoto?.tempURL}
                  showLastMessage={lastContactMessage}
                  typing={typingUsersById.includes(chat?.contact?.id)}
                  selectedChat={chat.id === activeChatId ? true : false}
                  isOnline={onlineUsersById.includes(chat?.contact?.id)}
                />
              </li>
            );
          })}
        </>
        :
        <NoResults existingData={existingData} noDataMessage={'Find your friends by clicking the button below and start chatting'} />
      }
    </>
  )
}
