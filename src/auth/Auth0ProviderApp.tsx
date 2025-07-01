import { Auth0Provider } from "@auth0/auth0-react";
import { FC } from "react";
import { useNavigate } from "react-router";

const VITE_AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const VITE_AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
// Ya no necesitas VITE_AUTH0_CALLBACK_URL para popup
const VITE_AUTH0_CALLBACK_URL = import.meta.env.VITE_AUTH0_CALLBACK_URL;
const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

type Props = {
  children: React.JSX.Element;
};

export const Auth0ProviderApp: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const onRedirectCallback = () => {
    navigate("/login-redirect");
  };

  if (!(VITE_AUTH0_DOMAIN && VITE_AUTH0_CLIENT_ID)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={VITE_AUTH0_DOMAIN}
      clientId={VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        audience: VITE_AUTH0_AUDIENCE,
        // Cambiamos redirect_uri por el origin actual
        // redirect_uri: `${window.location.origin}/callback`,
        redirect_uri: `${VITE_AUTH0_CALLBACK_URL}/callback`,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};