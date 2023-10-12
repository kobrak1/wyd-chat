import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Main from './pages/Main';
import { Auth } from './pages/Auth';
import { Chat } from './components/Chat';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUserChats } from './redux/reducers/userChatsReducer';
import { useEffect } from 'react';
import { keepUserSessionAlive } from './redux/reducers/userAuthenticationReducer';
import { LocalStorageManager } from './utils/LocalStorageManager';
import { initializeUserContacts } from './redux/reducers/userContactsReducer';
import { Toast } from './components/Toast';

function PrivateRoute({ redirectPath = '/auth' }) {
  const { user } = useSelector(state => state.userAuthentication)

  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      dispatch(initializeUserChats(user.id))
      dispatch(initializeUserContacts(user.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default function App() {
  const isAuthenticated = useSelector(state => state.userAuthentication)?.isAuthenticated
  const { getItem } = LocalStorageManager

  const dispatch = useDispatch()

  useEffect(() => {
    const userInStorage = getItem('user')

    if (!isAuthenticated && userInStorage) {
      dispatch(keepUserSessionAlive(userInStorage))
    }
  }, [getItem, isAuthenticated, dispatch])

  return (
    <>
      <Router>
        <Routes>
          <Route path='/dev' element={<Toast />} />
          <Route path='*' element={<Navigate to={'/auth'} />} />
          <Route path='/auth' element={<Auth />} />
          <Route element={<PrivateRoute />} >
            <Route path='/chat' element={<Main />} >
              <Route path='/chat/:id' element={<Chat />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toast />
    </>
  )
}
