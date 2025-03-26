import { Smartphone, Monitor, Laptop, Apple } from "lucide-react";
import { FaWindows, FaApple, FaLinux, FaAndroid } from "react-icons/fa";
import { JSX } from "react";
import AppleLogo from "../icon/Apple";

const osIcons: Record<string, JSX.Element> = {
  Windows: <FaWindows size={32} />,
  MacOS: <FaApple size={32} />,
  Linux: <FaLinux size={32} />,
  Android: <FaAndroid size={32} />,
  iOS: <AppleLogo size={70} />,
};

const deviceIcons: Record<string, JSX.Element> = {
  desktop: <Monitor size={20} />,
  laptop: <Laptop size={20} />,
  mobile: <Smartphone size={20} />,
};
export { deviceIcons, osIcons };
