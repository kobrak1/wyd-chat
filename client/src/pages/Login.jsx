import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RegisterForm from './Register';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/reducers/userAuthenticationReducer';

export function Login() {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isAuthenticated } = useSelector(state => state.userAuthentication)

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate('/chat')
    }
  }, [user, isAuthenticated, navigate])

  function handleLogin(event) {
    event.preventDefault()

    dispatch(loginUser({ username, password }))
  }

  function handleShowRegisterForm(event) {
    event.preventDefault()

    setShowRegisterForm(!showRegisterForm)
  }

  return (
    <div className="flex justify-center min-h-screen bg-blueChat-100 ">
      {!showRegisterForm ?
        <div className="min-h-screen flex flex-col items-center justify-center pb-40">
          <div className="shadow-xl bg-blueChat-200 p-8 rounded-lg">
            <h3 className="text-xl mb-2 text-white font-semibold">Login</h3>
            <div className="flex flex-col items-center w-60">
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={(event) => setUserName(event.target.value)}
                  className="mb-2 p-2 rounded border bg-white border-gray-400 w-full glow"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="mb-4 p-2 rounded border bg-white border-gray-400 w-full glow"
                  required
                />
                <button
                  type="submit"
                  className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200'
                >
                  Login
                </button>
              </form>
              <button
                onClick={handleShowRegisterForm}
                className="w-full mt-2 bg-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Register
              </button>
            </div>
          </div>
        </div>
        : <RegisterForm handleShowRegisterForm={handleShowRegisterForm} />
      }
    </div>
  )
}