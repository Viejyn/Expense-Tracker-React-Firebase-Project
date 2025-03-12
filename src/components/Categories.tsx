import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import type { Category, CategoryForm } from '../types/category';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, deleteCategory, getCategories, updateCategory } from '../store/actions/categoryActions';
import { RootState } from '../store';
import { SketchPicker } from 'react-color';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Mode } from '../types/general';
import Records from './Records';

const emptyForm: CategoryForm = {
  name: "",
  type: "expense",
  color: "black"
}

function Categories() {
    const dispatch = useDispatch<any>();
    const { data, loading, error} = useSelector((state: RootState) => state.categories);
    const records = useSelector((state: RootState) => state.records.data);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("new");
    const [form, setForm] = useState<CategoryForm>(emptyForm);
    const [updateId, setUpdateId] = useState<string | number | null>(null);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    
    const showModal = (mode: Mode) => {
      setIsModalOpen(true);
      setMode(mode);
    };

    const handleOk = () => {
      if(mode === "new") {
        dispatch(addCategory(form));
      } else if(mode === "edit" && typeof updateId === "string") {
        dispatch(updateCategory(form, updateId)); 
      } else if(mode === "delete" && typeof deleteId === "string") {
        dispatch(deleteCategory(deleteId)); 
      }
    
      setIsModalOpen(false);
      setMode("new");
      setForm(emptyForm);
      setUpdateId(null);
      setDeleteId(null);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
      setMode("new");
      setForm(emptyForm);
      setUpdateId(null);
      setDeleteId(null);
    };

    const columns: TableProps<Category>['columns'] = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          render: ( text: string, category: Category) => {
            return <Tag color={category.color}>{text.toUpperCase()}</Tag>;
          },
        },
        {
         title: 'Action',
         key: 'action',
         render: (text: string, category: Category) => (   
             <Space size="middle">
               <EditOutlined 
                 style={{ color: "#0390fc" }} 
                 onClick={() => {
                   showModal("edit");
                   setForm(category);
                   setUpdateId(category.id);
                 }}
               />
               <DeleteOutlined 
                 style={{ color: "#c20808" }}
                 onClick={() => {
                  showModal("delete");
                  setDeleteId(category.id);
                 }}
               />
             </Space>
          ),
        },
    ];

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
      console.log("Fetched categories:", data); 
    }, [data]);

    useEffect(() => {
      console.log("Harcama Kayıtları:", records);
    }, [records]);

    return (      
      <React.Fragment>
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <Button type="primary" onClick={() => showModal("new")}>
              New Category
            </Button>
          </div>
          <Modal 
           title={mode === "new" ? "Create New Category" : mode === "edit" ? "Update Category" : "Delete Category"} 
           open={isModalOpen} 
           onOk={handleOk} 
           onCancel={handleCancel} 
           okButtonProps={{ disabled: !(mode === "delete") && !form.name }} 
          >
           {mode === "edit" || mode === "new" ?
            <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            >
             <Form.Item label="Category Name">
               <Input 
                 name='name' 
                 value={form.name} 
                 onChange={e => setForm({ ...form, name: e.target.value })} 
               />
             </Form.Item>
             <Form.Item label="Category Type">
               <Select 
                defaultValue="expense" 
                value={form.type}
                onChange={(type) => setForm({ ...form, type: type as "income" | "expense" })}
               >
                 <Select.Option value="income">Income</Select.Option>
                 <Select.Option value="expense">Expense</Select.Option>
               </Select>
             </Form.Item>
             <Form.Item label="Color">
               <SketchPicker 
                 color={form.color}
                 onChange={color => setForm({ ...form, color: color.hex })} 
               />
             </Form.Item>  
            </Form> 
           : mode === "delete" ? <>Are you sure?</> : null            
           }                   
          </Modal>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading} 
          rowKey={(record) => String(record.id)} 
        />
      </React.Fragment>   
    );
}

export default Categories;