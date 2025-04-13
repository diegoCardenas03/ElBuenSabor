import Logo from '../assets/img/BuenSaborLogo.png'
import CartIcon from '../assets/icons/shopping-cart.svg'


const Navbar = () => {
  return (
    <>
      <nav className="w-screen h-18 bg-primary flex justify-between items-center px-4">
        <img src={Logo} alt="" />
        <div className='flex items-center gap-5'>
          <p>INGRESAR</p>
          <img src={CartIcon} alt="Abrir Carrito" />
        </div>
      </nav>
    </>
  )
}

export default Navbar