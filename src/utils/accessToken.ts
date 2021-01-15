export const setAccessToken = (t: string): void => {
  sessionStorage.setItem('sid', t);
};

export const getAccessToken = (): string => {
  return sessionStorage.getItem('sid') as string;
};
