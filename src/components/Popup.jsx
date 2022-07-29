export const Popup = ({ children }) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#0000008c] z-[999999]">
      {children && children}
    </div>
  )
}
