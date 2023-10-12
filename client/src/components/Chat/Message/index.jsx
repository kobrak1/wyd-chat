import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import Linkify from 'linkify-react';
import { useSelector } from 'react-redux';
import { MessageFile } from './FileMessage';

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
            ? 'bg-blueChat-300 text-white transition-colors rounded-tl-lg hover:bg-blueChat-400'
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
        <MessageFile message={message} />
      </div>
    </li>
  );
}
