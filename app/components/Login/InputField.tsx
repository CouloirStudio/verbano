import React, {ReactNode} from 'react';
import styles from './login.module.scss';

interface InputFieldProps {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({label, children, icon}) => {
  return (
    <div className={styles.inputField}>
      {children}
      <span>{label}</span>
      {icon && <div className={styles.icon}>{icon}</div>}
    </div>
  );
};

export default InputField;
