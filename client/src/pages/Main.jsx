import { Sidebar } from '../components/Sidebar';
import { useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux'
import { EmptyChat } from '../components/Chat/EmptyChat';
import { Redirect } from '../components/Redirect/Redirect';
import { Loader } from '../components/Loader/Loader';
import { SidebarProvider } from '../context/SidebarContext';

function Main() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: chatRooms, loading: chatsLoading, error: chatsError } = useSelector(state => state.userChats)
  const { loading: usersLoading, error: usersError } = useSelector(state => state.userContacts)

  const activeChatId = chatRooms?.activeChat?.id

  useEffect(() => {
    // * Navigate to the correct url when activating a chat
    const navigationToChatRoomRequired = activeChatId && activeChatId !== id && !chatsError && !usersError

    if (navigationToChatRoomRequired) {
      navigate(`/chat/${activeChatId}`)
    }
  }, [activeChatId, id, navigate, chatsError, usersError])

  if (chatsError || usersError) {
    <Redirect />
  }

  if (chatsLoading || usersLoading) {
    <Loader />
  }

  return (
    <SidebarProvider>
      <main id='main-container' className='w-full h-screen flex flex-nowrap bg-blur'>
        <Sidebar />
        {activeChatId ?
          <Outlet />
          :
          <EmptyChat />
        }
      </main>
    </SidebarProvider>
  );
}

export default Main;
