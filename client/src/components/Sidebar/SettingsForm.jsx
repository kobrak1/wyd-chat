import { useDispatch } from 'react-redux'
import { useField } from '../../hooks/useField'
import { AiOutlineCheck } from 'react-icons/ai'
import { updateUserAction } from '../../redux/reducers/userAuthenticationReducer'
import { useEffect, useState } from 'react'
import { useProfilePhotoInput } from '../../hooks/useProfilePhotoInput'

export function SettingsForm({ user, handleShowEditUserForm }) {
  const [showSubmitButton, setShowSubmitButton] = useState(false)

  const firstName = useField('text', user.firstName)
  const lastName = useField('text', user.lastName)

  const { rawPhoto, photoInputComponent } = useProfilePhotoInput(user.avatarPhoto?.tempURL)

  const dispatch = useDispatch()

  useEffect(() => {
    if (firstName.inputs.value !== user.firstName ||
      lastName.inputs.value !== user.lastName ||
      (rawPhoto?.name && !user.avatarPhoto?.name?.includes(rawPhoto.name))
    ) {
      return setShowSubmitButton(true)
    }

    setShowSubmitButton(false)

  }, [firstName.inputs.value, lastName.inputs.value, rawPhoto?.name, user.avatarPhoto?.name, user.firstName, user.lastName])

  function handleSubmit(event) {
    event.preventDefault()

    const updatedUser = {
      id: user.id,
      firstName: firstName.inputs.value,
      lastName: lastName.inputs.value,
      file: rawPhoto
    }

    dispatch(updateUserAction(updatedUser))
    setShowSubmitButton(false)

    // TODO: replace with transition
    setTimeout(() => {
      handleShowEditUserForm()
    }, 200);
  }

  return (
    <form onSubmit={handleSubmit} >
      <div className='p-4 mt-4 w-full'>
        {photoInputComponent}
        <div className="mb-2 mt-4">
          <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            minLength={2}
            {...firstName.inputs}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            autoComplete="familiy-name"
            required
            minLength={2}
            {...lastName.inputs}
          />
        </div>
      </div>
      {showSubmitButton &&
        <div
          id='settings-submit-container'
          className='absolute bottom-4 right-5'
        >
          <div
            id='settings-submit-background'
            className='bg-blueChat-400 w-14 h-14 rounded-full flex justify-center items-center'
          >
            <button
              id='settings-submit-button'
              type='submit'
            >
              <AiOutlineCheck size='1.5rem' color='white' />
            </button>
          </div>
        </div>
      }
    </form>
  )
}