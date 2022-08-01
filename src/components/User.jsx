import Logo from '../assets/logo.svg'

export const Profile = () => {
  return (
    <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[#545454] bg-[#141414]">
      <img src={Logo} alt="Newtron" className="w-auto h-auto mb-2" />
    </div>
  )
}
