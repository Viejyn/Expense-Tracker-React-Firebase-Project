import { Button, Form, Input, Result } from 'antd';
import showError from '../utils/showError';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm, UserDispatch } from '../types/user';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/userActions';
import { RootState } from '../store';
import { useEffect } from 'react';
import showSuccess from '../utils/showSuccess';

type FieldType = {
    email?: string;
    password?: string;
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<UserDispatch>();

    const {data, loading, error} = useSelector((state: RootState) => state.user);

    const onFinish = (values: LoginForm) => {
      dispatch(login(values));
    };

    useEffect(() => {
      if (error) showError(error);
    }, [error]);

    useEffect(() => {
      if (data?.email) showSuccess("You have successfully logged in!");
    }, [data?.email]);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if(token) {
        navigate("/");
      }
    }, [data]);

    // location.state'in türünü belirtmek için as ifadesini kullanıyoruz
    const { newSignUp } = (location.state as { newSignUp?: boolean }) || {};

    console.log({ location });
    
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>Please login</h2>
        {newSignUp && (
          <Result
            status="success"
            title="You successfully signed up."
            subTitle="Please login by using your credentials."
          />
        )}
    
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
    </Form>
  );
}
