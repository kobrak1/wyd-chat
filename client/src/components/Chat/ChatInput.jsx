import { useEffect, useMemo, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useParams } from 'react-router';
import debounce from 'lodash.debounce'
import { useDispatch, useSelector } from 'react-redux';
import { sendThisUserIsTyping, sendThisUserStoppedTyping } from '../../redux/reducers/userContactsReducer';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { BsEmojiSmile } from 'react-icons/bs'
import { ImAttachment } from 'react-icons/im'
import { createChatRoomMessage } from '../../redux/reducers/userChatsReducer';
import { toast } from '../../redux/reducers/notificationsReducer';

export function ChatInput() {
  const { id } = useParams()
  const { user } = useSelector(state => state.userAuthentication)
  const activeChat = useSelector((state) => state.userChats).data.activeChat

  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      setNewMessage('')

      return (() => dispatch(sendThisUserStoppedTyping({
        from: user.id,
        to: activeChat.contact.id
      }))
      )
    }
    // * We want stale closure of activeChat here to send the stop typing signal to the correct user (the one of the previously selected chat\)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function submitNewMessage(text, file) {
    const newMessage = {
      from: user.id,
      to: activeChat.contact.id,
      text,
      file,
      chatRoomId: id
    }

    dispatch(createChatRoomMessage(newMessage))
  }

  // * Debounce the typing indication emit
  // * useMemo instead of useCallback because of EsLint error (see https://github.com/facebook/react/issues/19240)
  const debouncedTypingIndicationEmit = useMemo(() =>
    debounce(() => dispatch(sendThisUserIsTyping({
      from: user.id,
      to: activeChat.contact.id
    })), 500)
    , [activeChat.contact.id, dispatch, user.id])

  const handleChangeNewMessage = (event) => {
    if (event.target.value !== '') {
      debouncedTypingIndicationEmit()
    }
    else if (event.target.value === '') {
      // * Delay the stopped typing emit to compensate for the debounce
      setTimeout(() => {
        dispatch(sendThisUserStoppedTyping({
          from: user.id,
          to: activeChat.contact.id
        }))
      }, 500)
    }

    setNewMessage(event.target.value)
  }

  function handleSubmitNewMessage(event) {
    event.preventDefault()

    if (newMessage && newMessage.trim() !== '') {
      submitNewMessage(newMessage)
      setNewMessage('')
      setShowEmojiPicker(false)

      // * Delay the stopped typing emit to compensate for the debounce
      setTimeout(() => {
        dispatch(sendThisUserStoppedTyping({
          from: user.id,
          to: activeChat.contact.id
        }))
      }, 500)
    }
  }

  function handleSendFile(event) {
    const file = event.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      dispatch(toast('File size can\'t be bigger than 5MB', 'error'))
      return
    }

    submitNewMessage(null, file)
  }

  function onEmojiSelection(emojiData, event) {
    setNewMessage(
      (prevMessage) =>
        `${prevMessage} ${emojiData.native}`
    )
    textareaRef.current.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmitNewMessage(event)
    }
    if (event.key === 'Escape' && showEmojiPicker) {
      setShowEmojiPicker(false)
    }
  }

  function handleShowEmojiPicker(event) {
    event.preventDefault()
    event.stopPropagation()

    setShowEmojiPicker(!showEmojiPicker)
    textareaRef.current.focus()
  }

  function handleClickOutsideEmojiPicker() {
    if (showEmojiPicker) {
      setShowEmojiPicker(false)
      textareaRef.current.focus()
    }
  }

  function fileInputClickHandler() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <form onSubmit={handleSubmitNewMessage} className="flex pt-1 pb-4 px-6">
      <div className='relative w-full'>
        {showEmojiPicker &&
          <div className='absolute bottom-12'>
            <Picker
              data={data}
              onEmojiSelect={onEmojiSelection}
              onClickOutside={handleClickOutsideEmojiPicker}
              previewPosition='none'
              navPosition='bottom'
            />
          </div>
        }
        <div className='flex bg-white rounded-lg shadow-lg hover:shadow-xl'>
          <div className='flex items-center justify-center m-2 mt-auto'>
            <button onClick={handleShowEmojiPicker} >
              <BsEmojiSmile size='1.3rem' color='grey' />
            </button>
          </div>
          <TextareaAutosize
            value={newMessage}
            onChange={handleChangeNewMessage}
            maxRows={15}
            minLength={1}
            maxLength={4000}
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            className='p-2 resize-none w-full focus:outline-none rounded-lg text-gray-600'
            placeholder="Message"
          />
          <button
            onClick={fileInputClickHandler}
            className='flex items-center justify-center m-2 mt-auto'
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleSendFile}
            />
            <ImAttachment size='1.3rem' color='grey' />
          </button>
        </div>
      </div>
      <button type='submit' className='hidden' />
    </form>
  )
}