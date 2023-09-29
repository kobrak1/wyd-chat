// src/components/RegisterForm.js
import { useState } from 'react';
import { validateEmail } from '../utils/helperFunctions';
import UsersService from '../services/usersService';

const RegisterForm = ({ handleShowRegisterForm }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // * For now username can only be an email address
    const validUsername = validateEmail(formData.username)

    if (!validUsername) {
      // TODO: Show notification
      console.error('Invalid email address!');
      return
    }

    UsersService.register(formData)
      .then(_ => {
        //TODO: Notification here
        handleShowRegisterForm(e)
      })
      .catch(error => {
        console.error(error)
        //TODO: Notification here
      })
  }

  return (
    <div className="flex justify-center min-h-screen bg-blueChat-100">
      <div className='min-h-screen flex flex-col items-center justify-center pb-40'>
        <div className='shadow-xl bg-blueChat-200 p-8 rounded-lg'>
          <h2 className="text-2xl font-semibold text-center text-white mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block mb-2 text-sm text-white font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 glow"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block mb-2 text-sm text-white font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 glow"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm text-white font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="username"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 glow"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm text-white font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 glow"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Register
            </button>
          </form>
          <button
            onClick={handleShowRegisterForm}
            className="w-full mt-2 bg-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>

  );
};

export default RegisterForm;
