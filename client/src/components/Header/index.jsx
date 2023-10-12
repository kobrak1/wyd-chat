import logo from '../../assets/wyd-logos-blue/logo-tab.png';

export function Header() {
  return (
    <header className="flex items-center justify-between p-2 bg-white">
      <div className="flex items-center">
        <img
          src={logo}
          alt="wyd-chat logo"
          className="max-w-24 max-h-24"
        />
        <h1 className="text-2xl ml-4">wyd chat</h1>
      </div>
    </header>
  )
}