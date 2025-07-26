import { createContext, ReactNode, useState } from "react";

export interface createContextProps {
  isMicAllowed: boolean;
  isCamAllowed: boolean;
  setMicAllowed: (value: boolean) => void;
  setCamAllowed: (value: boolean) => void;
}

interface MediaPermissionsProviderProps {
  children: ReactNode;
}

export const MediaPermissionsContext = createContext<createContextProps>(
  {} as createContextProps
);

export const MediaPermissionsProvider = ({
  children,
}: MediaPermissionsProviderProps) => {
  const [isMicAllowed, setMicAllowed] = useState<boolean>(false);
  const [isCamAllowed, setCamAllowed] = useState<boolean>(false);

  return (
    <MediaPermissionsContext.Provider
      value={{ isMicAllowed, isCamAllowed, setMicAllowed, setCamAllowed }}>
      {children}
    </MediaPermissionsContext.Provider>
  );
};
