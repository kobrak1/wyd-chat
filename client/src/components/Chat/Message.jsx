import React, { useEffect } from 'react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import Linkify from 'linkify-react';
import { useSelector } from 'react-redux';

export function Message({ message }) {
  const { user } = useSelector((state) => state.userAuthentication);

  const isUserMessage = message?.from === user.id;

  const parsedMessageTime = format(parseISO(message?.timestamp), 'h:mm a');

  const options = {
    className: 'underline',
    target: '_blank',
    rel: 'noreferrer',
    defaultProtocol: 'https',
    truncate: 100,
  };

  useEffect(() => {
    // Add a click event listener to the window
    const handleWindowClick = () => {
      // Hide the "Download" button when a click event is detected outside the image container
      const downloadButton = document.querySelector('.download-button');
      if (downloadButton) {
        downloadButton.classList.add('hidden');
      }
    };

    // Attach the event listener
    window.addEventListener('click', handleWindowClick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <li
      className={clsx('max-w-[45%] p-2', isUserMessage ? 'self-end' : 'self-start')}
    >
      <p
        className={clsx(
          'text-xs',
          isUserMessage ? 'mr-2 text-right text-gray-500' : 'ml-2'
        )}
      >
        {parsedMessageTime}
      </p>
      <div
        className={clsx(
          isUserMessage
            ? 'bg-blueChat-300 text-white transition-colors rounded-tl-lg shadow-lg hover:bg-blueChat-400'
            : 'rounded-tr-lg bg-white text-gray-600 hover:bg-gray-100',
          'rounded-bl-lg rounded-br-lg shadow-lg'
        )}
      >
        {message?.text && (
          <Linkify
            as="p"
            options={options}
            className="text-sm break-words pt-[6px] pr-[.5rem] pb-[.376rem] pl-[.625rem]"
          >
            {message?.text}
          </Linkify>
        )}
        {message.file && message.file.match(/\.(JPEG|JPG|GIF|PNG)$/) ? (
          // Display image if the message contains an image file
          <div
            className="relative flex p-2 bg-blueChat-300 rounded-lg shadow-lg"
            onMouseEnter={(e) => {
              // Show the "Download" button when hovering
              e.currentTarget.querySelector('.download-button').classList.remove('hidden');
            }}
            onMouseLeave={(e) => {
              // Hide the "Download" button when no longer hovering
              e.currentTarget.querySelector('.download-button').classList.add('hidden');
            }}
          >
            <img
              src={message.file}
              alt="Uploaded Image"
              className="max-w-full h-auto"
              style={{ cursor: 'pointer' }}
            />
            <button
              className="download-button hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 bg-white text-blueChat-300 rounded-lg shadow-lg transition-colors hover:text-white hover:bg-blueChat-300"
              onClick={() => {
                // Trigger the download when the button is clicked
                const link = document.createElement('a');
                link.href = message.file;
                link.download = 'image.jpg'; // Set the desired filename
                link.click();
              }}
            >
              Download
            </button>
          </div>
        ) : message.file ? (
          // Display a link if the message contains a non-image file
          <a
            href={message.file}
            target="_blank"
            rel="noreferrer"
            className="text-sm break-words pt-[6px] pr-[.5rem] pb-[.376rem] pl-[.625rem] underline"
          >
            {message.file}
          </a>
        ) : null}
      </div>
    </li>
  );
}
