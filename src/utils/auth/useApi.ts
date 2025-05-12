import { useAuth0 } from '@auth0/auth0-react';

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = await getAccessTokenSilently();
    return fetch(url, {
      ...options,
       headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };
  return { fetchWithAuth };
};