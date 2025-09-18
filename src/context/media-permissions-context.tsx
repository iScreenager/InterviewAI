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
  const [isMicAllowed, setMicAllowed] = useState<boolean>(true);
  const [isCamAllowed, setCamAllowed] = useState<boolean>(true);

  return (
    <MediaPermissionsContext.Provider
      value={{ isMicAllowed, isCamAllowed, setMicAllowed, setCamAllowed }}
    >
      {children}
    </MediaPermissionsContext.Provider>
  );
};
