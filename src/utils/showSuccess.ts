import { message } from "antd";

const showSuccess = (successMessage: string) => {
    message.open({
      type: 'success',
      content: successMessage,
    });
};

export default showSuccess;