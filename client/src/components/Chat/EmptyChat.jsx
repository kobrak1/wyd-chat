import clsx from 'clsx'
import { useSelector } from 'react-redux'

export function EmptyChat() {
  const activeChat = useSelector(state => state.userChats).data?.activeChat

  return (
    <div className={clsx('blur-overlay w-full flex justify-center items-center', !activeChat && 'hidden md:flex')} >
      <h3 className='text-xl'>Select or start a conversation</h3>
    </div>
  )
}