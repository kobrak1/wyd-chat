import { CiSettings, CiLogout } from 'react-icons/ci';
import logo from '../../assets/wyd-logos-blue/logo-tab.png';
import { Icon } from '../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/reducers/userAuthenticationReducer';
import { Menu, Transition } from '@headlessui/react'
import { GiHamburgerMenu } from 'react-icons/gi'

export function SidebarHeader({ handleShowSettings }) {
  const { user } = useSelector(state => state.userAuthentication)

  const dispatch = useDispatch()

  return (
    <div className='p-4 shadow-md w-full'>
      <div className='flex justify-between items-center'>
        <div className='mx-4 w-16 h-16'>
          <img src={logo} className='w-16 h-16' />
        </div>
        <div className='mx-4'>
          <Menu>
            <Menu.Button>
              <Icon IconComponent={GiHamburgerMenu} />
            </Menu.Button>
            <Transition
              className='absolute right-12 top-15 z-20 '
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items
                className='rounded-xl shadow-xl font-semibold text-sm bg-slate-100 w-60 '
              >
                <Menu.Item
                  className='p-2 rounded-xl hover:bg-blueChat-50 w-full text-left'
                >
                  <button
                    onClick={handleShowSettings}
                    className='flex items-center'
                  >
                    <CiSettings size='1.5rem' />
                    <div className='w-full ml-5'>
                      <span>Account settings</span>
                    </div>
                  </button>
                </Menu.Item>
                <Menu.Item
                  className='p-2 rounded-xl hover:bg-blueChat-50 w-full text-left'
                >
                  <button
                    className='flex items-center'
                    onClick={() => dispatch(logoutUser(user))}
                  >
                    <CiLogout size='1.5rem' />
                    <div className='w-full ml-5'>
                      <span>Logout</span>
                    </div>
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
