import { message } from "antd";

const showError = (error: string) => {
    message.open({
      type: 'error',
      content: error,
    });
};

export default showError;