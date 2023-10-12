import { ImageMessage } from './ImageMessage'
import { OtherFilesMessage } from './OtherFilesMessage'

export function MessageFile({ message }) {
  if (!message?.file) return null

  const messageContainsImage = message.file.type.toLowerCase().match(/.(jpeg|jpg|gif|png)/)

  return (
    <>
      {messageContainsImage ? (
        <ImageMessage message={message} />
      ) : (
        // * Display a link if the message contains a non-image file
        <OtherFilesMessage message={message} />
      )}
    </>
  )
}