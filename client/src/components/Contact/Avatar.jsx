import defaultAvatar from '../../assets/default-avatar/default_avatar.png'
import { BsFillCircleFill } from 'react-icons/bs'

export function Avatar({ avatar, typing, isOnline }) {
  const isTyping = typing ? 'border-2 border-blueChat-400' : 'border-2 border-transparent'

  return (
    <div className="relative w-14 h-14">
      <img
        src={avatar || defaultAvatar}
        className={`rounded-full w-14 h-14 ${isTyping}`}
        alt="avatar image"
      />
      {isOnline && <BsFillCircleFill color='#22c55e' className='absolute bottom-0 right-0' />}
    </div>)
}