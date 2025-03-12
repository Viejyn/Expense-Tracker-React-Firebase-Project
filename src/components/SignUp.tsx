import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import showError from '../utils/showError';

export default function SignUp() {

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
    };

    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try{
          // Firebase Authentication ile kullanıcı oluştur
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          const user = userCredential.user;

          // Kullanıcıyı Firestore veritabanına ekle
          await setDoc(doc(db, "users", user.uid), {
              username: values.username,
              email: values.email,
              full_name: values.full_name || "",
              createdAt: new Date(),           
          }); 
          navigate("/login", { state: { newSignUp: true } });
        } catch(error) {
            console.log({ error });
            showError((error as any).message);
        }  
    };

    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
      >
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>Register for an account</h2>
        <Form.Item name={['username']} label="Username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item 
          label="Password" 
          name="password" 
          rules={[
            { required: true, message: 'Please input your password!'}, 
            { min: 6, message: 'Password must be at least 6 characters!'}
            ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name={['email']} label="Email" rules={[{ type: 'email', required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={['full_name']} label="Full Name">
          <Input />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
}
