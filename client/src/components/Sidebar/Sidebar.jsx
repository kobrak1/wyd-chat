import { useState } from 'react';
import { Contact } from '../Contact'
import { useAuth } from '../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { activateChat, createUserChatRoomAction } from '../../redux/reducers/userChatsReducer';

export function Sidebar({ chats, users, activeChatId }) {
  const [toggleNewChat, setToggleNewChat] = useState(false)

  const { user } = useAuth()
  const dispatch = useDispatch()

  function handleSelectChat(chatId) {
    dispatch(activateChat(chatId))
  }

  function handleNewChatView() {
    setToggleNewChat(!toggleNewChat)
  }

  function handleCreateChatRoom(contactId) {
    const existingChat = chats?.find(chat => chat.contact.id === contactId)

    if (!existingChat) {
      const newChatRoom = {
        members: [user.id, contactId]
      }

      dispatch(createUserChatRoomAction(newChatRoom))
    } else {
      dispatch(activateChat(existingChat.id))
      handleNewChatView()
    }
  }

  return (
    <>
      <div className='relative sidebar flex flex-col w-[22rem] h-screen items-center pt-10 gap-6 bg-blueChat-100 px-8'>
        <div className='sidebar-header font-bold text-2xl self-start'>
          <h2>{!toggleNewChat ? 'Your Chats' : 'New Chat'}</h2>
        </div>
        <div>
          {chats && users &&
            <ul className='chat-list flex flex-col gap-y-1 w-full'>
              <>
                {!toggleNewChat ?
                  <>
                    {chats.map((chat) => (
                      <li key={chat.id} onClick={() => handleSelectChat(chat.id)} className='hover:cursor-pointer'>
                        <Contact
                          key={chat?.contact?.id}
                          name={chat?.title}
                          avatar={chat?.contact?.avatarPhoto}
                          lastMessage={chat?.contact?.lastMessage}
                          typing={false}
                          selectedChat={chat.id === activeChatId ? true : false}
                        />
                      </li>
                    ))}
                  </>
                  :
                  <>
                    {users.map((user) => (
                      <li key={user.id} onClick={() => handleCreateChatRoom(user.id)} className='hover:cursor-pointer'>
                        <Contact
                          key={user.id}
                          name={`${user?.firstName} ${user?.lastName}`}
                          avatar={user?.avatarPhoto}
                          showLastSeen={user?.lastTimeOnline}
                        />
                      </li>
                    ))}
                  </>
                }
              </>
            </ul>
          }
        </div>
        <div className='absolute bottom-10 right-4'>
          <button onClick={handleNewChatView} className='bg-blueChat-200'>{!toggleNewChat ? 'New Chat' : 'Your Chats'}</button>
        </div>
      </div>
    </>
  );
}
