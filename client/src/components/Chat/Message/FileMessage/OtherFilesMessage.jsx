import { useRef } from 'react'
import { AiFillFile } from 'react-icons/ai'

export function OtherFilesMessage({ message }) {
  const downloadFileRef = useRef(null)

  function handleDownloadFile() {
    downloadFileRef.current.click()
  }

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  return (
    <div className='flex items-center cursor-pointer' onClick={handleDownloadFile} >
      <div className="p-1 pl-2">
        <AiFillFile size='2.5rem' />
      </div>
      <div className='overflow-hidden pt-[6px] pr-[.5rem] pb-[.376rem] pl-[.625rem]'>
        <div className='line-clamp-2'>
          <a
            href={message.file.tempURL}
            ref={downloadFileRef}
            className="font-bold"
            download
          >
            {message.file.name}
          </a>
        </div>
        <div className='text-gray-300'>{formatBytes(message.file.size)}</div>
      </div>
    </div>
  )
}