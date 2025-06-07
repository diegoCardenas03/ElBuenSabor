import LogoIcon from "../../assets/img/BuenSaborLogo.png";
import iconFacebook from "../../assets/icons/facebook.svg";
import iconInstagram from "../../assets/icons/instagram.svg";
import iconTwitter from "../../assets/icons/twitter.svg";


export const Footer: React.FC = () => {
  const iconsRedes = [
    { icon: iconInstagram, text: "Icono Instagram"},
    { icon: iconTwitter, text: "Icono Twitter"},
    { icon: iconFacebook, text: "Icono Facebook"},
  ]

  return (
    <>
      <footer className="w-full bg-primary flex flex-col justify-center items-center gap-5 pt-4 relative ">
        <div className="bg-transparent flex flex-col justify-center items-center gap-5 mt-4">
          <img src={LogoIcon} alt="" className="w-15 h-15" />
          <p className="font-semibold">Av Belgrano 671, Mendoza, Argentina</p>
          <div className="flex gap-5 justify-center items-center">
            {iconsRedes.map((icon, index) => (
              <img src={icon.icon} key={index} alt={icon.text} className="w-8 h-8 cursor-pointer" />
            ))}
          </div>
        </div>
        <div className="bg-[#D3C9B9] w-full p-10 text-center flex flex-col justify-center items-center gap-5 mt-4">
          <p className="font-tertiary">El buen sabor. ©Designed byteam</p>
        </div>
      </footer>
    </>
  )
}

