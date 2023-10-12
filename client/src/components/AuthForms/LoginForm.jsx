import { useDispatch } from 'react-redux'
import { useField } from '../../hooks/useField'
import { loginUser } from '../../redux/reducers/userAuthenticationReducer'

export function LoginForm({ handleToggleForm }) {
  const username = useField('email')
  const password = useField('password')

  const dispatch = useDispatch()

  function handleLogin(event) {
    event.preventDefault()

    dispatch(loginUser({
      username: username.inputs.value,
      password: password.inputs.value
    }))
  }

  return (
    <>
      <form onSubmit={handleLogin} className='w-full' >
        <div className="mb-2">
          <label htmlFor="login-email" className="block mb-2 text-sm  font-medium">E-mail</label>
          <input
            id='login-email'
            name="username"
            placeholder="E-mail"
            required
            {...username.inputs}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="login-password" className="block mb-2 text-sm font-medium">Password</label>
          <input
            name="password"
            id='login-password'
            placeholder="Password"
            required
            minLength={8}
            {...password.inputs}
          />
        </div>
        <button
          type="submit"
          className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200'
        >
          Login
        </button>
      </form>
      <button
        onClick={handleToggleForm}
        className="w-full mt-2 border border-gray-500 bg-white py-2 rounded hover:bg-blue-600 hover:text-white focus:outline-none focus:ring focus:ring-blue-200"
      >
        Register
      </button>
    </>
  )
}