import { useRef, useState } from 'react'
import { MdOutlineAddAPhoto } from 'react-icons/md'
import defaultAvatar from '../assets/default-avatar/default_avatar.png'
import { useDispatch } from 'react-redux';
import { toast } from '../redux/reducers/notificationsReducer';

export function useProfilePhotoInput(avatarPhoto) {
  const [photoPreview, setPhotoPreview] = useState(avatarPhoto ? avatarPhoto : null);
  const [rawPhoto, setRawPhoto] = useState(null)
  const fileInputRef = useRef(null);

  const dispatch = useDispatch()

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) { // * 
      dispatch(toast('File size can\'t be bigger than 5MB', 'error'))
      return
    }

    setRawPhoto(file)

    const previewReader = new FileReader();
    previewReader.readAsDataURL(file);
    previewReader.onload = (e) => {
      setPhotoPreview(e.target.result)
    };
  }

  function clickHandler() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const photoInputComponent = (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      <div className="text-center relative">
        <div className='mt-2 w-40 h-40 m-auto'>
          <img
            src={photoPreview || defaultAvatar}
            className="w-40 h-40 rounded-full"
            alt="Current Profile"
          />
        </div>
        <div
          onClick={clickHandler}
          className='bg-transparent absolute top-0 w-full cursor-pointer'
        >
          <span
            className="w-40 h-40 m-auto flex items-center justify-center"
          >
            <MdOutlineAddAPhoto
              color='white'
              size='2rem'
            />
          </span>
        </div>
      </div>
    </div>
  )

  return {
    rawPhoto,
    photoInputComponent
  }
}