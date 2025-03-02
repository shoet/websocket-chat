import { CSSProperties, ReactNode } from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./index.module.css";

type IconProps = {
  size: number;
  color: string;
};

export const withIcon = (Icon: ReactNode) => {
  return (props: IconProps) => {
    const style = {
      "--size": props.size,
      "--color": props.color,
    } as CSSProperties;
    return (
      <span className={styles.icon} style={style}>
        {Icon}
      </span>
    );
  };
};

export const UserIcon = withIcon(<FontAwesomeIcon icon={faUser} />);
