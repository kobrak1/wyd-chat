import { BsFillPencilFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai'

export function ToggleSidebarView({ handleNewChatView, toggleNewChat }) {
  return (
    <div
      id='toggle-sidebar-view-container'
      className='absolute bottom-4 right-5'
    >
      <div
        id='toggle-sidebar-view-background'
        className='bg-blueChat-400 w-14 h-14 rounded-full flex justify-center items-center'
      >
        <button
          id='toggle-sidebar-view-button'
          onClick={handleNewChatView}
        >
          {!toggleNewChat ?
            <BsFillPencilFill size='1.5rem' color='white' />
            : <AiOutlineClose size='1.5rem' color='white' />
          }
        </button>
      </div>
    </div>
  )
}