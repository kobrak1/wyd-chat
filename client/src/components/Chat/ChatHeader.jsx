import { BsCameraVideo, BsSearch, BsTelephone } from 'react-icons/bs';
import { Button } from '../Button';
import { Contact } from '../Contact';
import { Icon } from '../Icon';
import { useSelector } from 'react-redux';
import { BiArrowBack } from 'react-icons/bi'
import { useSidebarContext } from '../../hooks/useSidebarContext';

export function ChatHeader({ activeChat, handleShowSearchChat }) {
  const { sidebarOpen, toggleSidebar } = useSidebarContext()

  const { typingUsersById, onlineUsersById } = useSelector(state => state.userContacts)

  return (
    <div className='bg-white p-4 shadow-md flex items-center'>
      <Button
        className='mr-2 block md:hidden'
        onClick={() => toggleSidebar(!sidebarOpen)}
        text={<BiArrowBack size='1.5rem' color='#70757' />}
      >
      </Button>
      <div className='w-full flex justify-between'>
        <Contact
          name={activeChat?.title}
          avatar={activeChat?.contact?.avatarPhoto?.tempURL}
          typing={typingUsersById.includes(activeChat?.contact?.id)}
          showLastTimeOnline={activeChat.contact?.lastTimeOnline}
          isOnline={onlineUsersById.includes(activeChat?.contact?.id)}
        />
        <div className='w-32 mx-4 flex justify-between'>
          <Button text={<Icon IconComponent={BsSearch} />} onClick={handleShowSearchChat} />
          <Button text={<Icon IconComponent={BsCameraVideo} />} />
          <Button text={<Icon IconComponent={BsTelephone} />} />
        </div>
      </div>
    </div>
  );
}