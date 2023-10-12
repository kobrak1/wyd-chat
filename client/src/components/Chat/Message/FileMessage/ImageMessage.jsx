import clsx from 'clsx';
import { useRef } from 'react'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { useSelector } from 'react-redux';

export function ImageMessage({ message }) {
  const downloadButtonRef = useRef(null)
  const downloadFileRef = useRef(null)

  const userId = useSelector((state) => state.userAuthentication)?.user?.id

  const isUserMessage = message?.from === userId

  function handleDownloadFile() {
    downloadFileRef.current.click()
  }

  return (
    // * Display image if the message contains an image file
    <div
      className="relative flex cursor-pointer"
      onClick={handleDownloadFile}
      onMouseEnter={() => {
        // * Show the "Download" button when hovering
        downloadButtonRef.current.classList.remove('hidden');
      }}
      onMouseLeave={() => {
        // * Hide the "Download" button when no longer hovering
        downloadButtonRef.current.classList.add('hidden');
      }}
    >
      <img
        src={message.file.tempURL}
        alt="Uploaded Image"
        className={clsx(isUserMessage
          ? 'rounded-tl-lg'
          : 'rounded-tr-lg',
          'rounded-bl-lg rounded-br-lg'
        )}
      />
      <a href={message.file.tempURL} className='hidden' ref={downloadFileRef} download />
      <button
        className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 transition-colors hover:text-blueChat-300"
        ref={downloadButtonRef}
      >
        <AiOutlineCloudDownload size='2rem' />
      </button>
    </div>
  )
}