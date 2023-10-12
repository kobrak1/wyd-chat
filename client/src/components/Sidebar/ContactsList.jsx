import { Contact } from '../Contact';
import { NoResults } from '../NoResults';

export function ContactsList({ filteredUsersData, handleCreateChatRoom, existingData }) {

  if (!filteredUsersData) {
    return null
  }


  return (
    <>
      {filteredUsersData.length > 0 ?
        <>
          {filteredUsersData.map((user) => {
            return (
              <li
                key={user.id}
                id='contact-list-item'
                onClick={() => handleCreateChatRoom(user.id)}
                className='hover:cursor-pointer hover:bg-blueChat-50 hover:rounded-lg bg-white'
              >
                <Contact
                  key={user.id}
                  name={`${user?.firstName} ${user?.lastName}`}
                  avatar={user?.avatarPhoto?.tempURL}
                  showLastTimeOnline={user?.lastTimeOnline} />
              </li>
            );
          })}
        </>
        :
        <NoResults existingData={existingData} noDataMessage={'Looks like you have no contacts here, invite your friends and start your epic conversations!'} />
      }
    </>
  );
}
