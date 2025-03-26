import {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
  useMemo,
  useCallback,
  Dispatch,
} from "react";
import { axios, getDeviceInfo } from "@/src/lib/utils";
import { User } from "@/src/@types";
import { isAxiosError } from "axios";

interface Context {
  token: string | null;
  account: User | null;
  isLoggedIn: boolean;
  register: (
    payload: { username: string; email: string; password: string },
    setIsAuthPageLoading: Dispatch<React.SetStateAction<boolean>>
  ) => Promise<unknown>;
  login: (
    payload: { email: string; password: string },
    rememberMe: boolean,
    setIsAuthPageLoading: Dispatch<React.SetStateAction<boolean>>
  ) => Promise<unknown>;
  logout: () => void;
  isLoading: boolean;
}

const initContext: Context = {
  token: null,
  account: null,
  isLoggedIn: false,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  isLoading: false,
};

const AuthContext = createContext(initContext);
const { Provider } = AuthContext;
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [account, setAccount] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [device, setDevice] = useState<Record<string, string> | null>(null);
  // Fetch device metadata once and store it
  useEffect(() => {
    (async () => {
      const { deviceId, ...device } = await getDeviceInfo();
      setDeviceId(deviceId);
      setDevice(device.device);
    })();
  }, []);

  // Keep token in sessionStorage
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("token");
    if (!sessionToken) {
      setToken(null);
    } else {
      setToken(sessionToken);
    }
  }, [token]);

  const register = useCallback(
    async (
      formData: { username: string; email: string; password: string },
      setIsAuthPageLoading: Dispatch<React.SetStateAction<boolean>>
    ) => {
      setIsAuthPageLoading(true);
      try {
        const {
          data: { data: accountData },
        } = await axios.post("/auth/register", formData);
        setAccount(accountData);
        return true;
      } catch (error) {
        // @ts-expect-error: no prob
        throw error?.response?.data?.message || error.message || error;
      } finally {
        setIsAuthPageLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    async (
      formData: { email: string; password: string },
      rememberMe: boolean,
      setIsAuthPageLoading: Dispatch<React.SetStateAction<boolean>>
    ) => {
      setIsAuthPageLoading(true);
      try {
        if (rememberMe && deviceId) {
          // @ts-expect-error: no prob
          formData = { ...formData, device, deviceId };
        }

        const {
          data: { data: accountData, token: JWTToken },
        } = await axios.post("/auth/login", formData);

        setAccount(accountData);
        setToken(JWTToken);
        setIsLoggedIn(true);

        if (!rememberMe) {
          sessionStorage.setItem("token", JWTToken);
        }

        return true;
      } catch (error) {
        // @ts-expect-error: no prob
        throw error?.response?.data?.message || error.message || error;
      } finally {
        setIsAuthPageLoading(false);
      }
    },
    [deviceId, device]
  );

  const logout = useCallback(async () => {
    if (deviceId) {
      await axios.post("/auth/logout", { deviceId });
    }
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setAccount(null);
    setToken(null);
  }, [deviceId]);

  const reLoginUser = useCallback(async () => {
    setIsLoading(true);
    if (!deviceId) return;
    try {
      const isUsingDeviceLogin = !token;

      const loginEndpoint = isUsingDeviceLogin
        ? "/auth/login/device"
        : "/auth/login";

      const requestData = isUsingDeviceLogin
        ? { deviceId }
        : { headers: { authorization: `Bearer ${token}` } };

      const {
        data: { data: accountData, token: JWTToken },
      } = await (isUsingDeviceLogin
        ? axios.post(loginEndpoint, requestData)
        : axios.get(loginEndpoint, requestData));

      setAccount(accountData);

      if (JWTToken && JWTToken !== token) {
        setToken(JWTToken);
        sessionStorage.setItem("token", JWTToken);
      }

      setIsLoggedIn(true);
    } catch (error) {
      if (
        isAxiosError(error) &&
        [400, 401, 404].includes(error.response?.status ?? 0)
      ) {
        await logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, deviceId]);

  // Periodically re-login the user
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(reLoginUser, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn, reLoginUser]);

  // Re-login user on app startup
  useEffect(() => {
    reLoginUser();
  }, [reLoginUser]);
  const value = useMemo(
    () => ({ token, account, isLoggedIn, register, login, logout, isLoading }),
    [token, account, isLoggedIn, isLoading, register, login, logout]
  );

  return <Provider value={value}>{children}</Provider>;
};
