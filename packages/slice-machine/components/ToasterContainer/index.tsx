import React from "react";

import {
  ToastContainer as ReactToastifyContainer,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDangerous, MdDone, MdError, MdWarning } from "react-icons/md";

const getIconAccordingToasterType = ({ type }: toast.TYPE): JSX.Element => {
  switch (type) {
    case toast.TYPE.INFO:
      return <MdError />;
    case toast.TYPE.ERROR:
      return <MdDangerous />;
    case toast.TYPE.SUCCESS:
      return <MdDone />;
    case toast.TYPE.WARNING:
      return <MdWarning />;
  }
};

const ToastContainer: React.FunctionComponent = () => {
  return (
    <ReactToastifyContainer
      autoClose={20000}
      hideProgressBar
      closeButton={false}
      position={toast.POSITION.TOP_CENTER}
      icon={getIconAccordingToasterType}
    />
  );
};

export default ToastContainer;
