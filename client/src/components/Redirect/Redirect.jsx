import { useDispatch, useSelector } from 'react-redux';
import { resetUserChatsState } from '../../redux/reducers/userChatsReducer';
import { logoutUser } from '../../redux/reducers/userAuthenticationReducer';
import { useNavigate } from 'react-router-dom';

export function Redirect() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { error: chatsError } = useSelector(state => state.userChats)
  const { error: usersError } = useSelector(state => state.userContacts)

  // TODO: Keep rendering the page and show chatsError or usersError notification if possible
  setTimeout(() => {
    dispatch(resetUserChatsState())

    const isMissingTokenError =
      chatsError.message.toLowerCase().includes('invalid token') ||
      usersError.message.toLowerCase().includes('invalid token') ||
      chatsError.message.toLowerCase().includes('token expired') ||
      usersError.message.toLowerCase().includes('token expired')

    if (isMissingTokenError) {
      return dispatch(logoutUser())
    }

    navigate('/')
  }, 1500);


  return (
    <div className='h-full w-full flex flex-col items-center mt-10'>
      <h1 className='text-2xl'>Redirecting</h1>
      <h3 className='text-lg'>{chatsError.message || usersError.message}</h3>
    </div>
  )
}