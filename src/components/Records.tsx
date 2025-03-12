import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Button, Form, Input, Modal, Select, Space, Table, TableProps, Tag } from "antd";
import { Record, RecordForm } from "../types/record";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { addRecord, deleteRecord, getRecords, updateRecord } from "../store/actions/recordActions";
import { Category } from "../types/category";
import { Mode } from "../types/general";
import { getCategories } from "../store/actions/categoryActions";

// Kategori adını ve rengini almak için yardımcı fonksiyon
const getCategoryDetails = (category_id: string, categories: Category[]) => {
  if (!category_id) return { name: "Bilinmeyen Kategori", color: "gray" }; 

  const category = categories.find(cat => String(cat.id) === String(category_id)); 
  return category ? { name: category.name, color: category.color } : { name: "Bilinmeyen Kategori", color: "gray" };
};

const emptyForm: RecordForm = {
    title: "",
    amount: 0,
    category_id: "0"
}

function Records() {
    const { data, loading, error } = useSelector((state: RootState) => state.records);
    const { data: categories } = useSelector((state: RootState) => state.categories);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("new");
    const [form, setForm] = useState<RecordForm>(emptyForm);
    const [updateId, setUpdateId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const dispatch = useDispatch<any>();

    useEffect(() => {
      dispatch(getRecords()); 
      dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
      console.log("Categories after dispatch:", categories.map(c => ({ id: c.id, name: c.name })));
    }, [categories]);

    useEffect(() => {
      console.log("Records Data:", data.map(r => ({
        id: r.id, category_id: r.category_id, type: typeof r.category_id
      })));
    }, [data]);
  
    const showModal = (mode: Mode) => {
        setIsModalOpen(true);
        setMode(mode);
    }; 

    const handleOk = () => {
        if(mode === "new") dispatch(addRecord(form));
        else if(mode === "edit" && updateId) dispatch(updateRecord(form, String(updateId)));
        else if(mode === "delete" && deleteId) dispatch(deleteRecord(String(deleteId)));
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

    const isFormValid = form.title && form.amount !== 0 && form.category_id !== "0";

    const columns: TableProps<Record>['columns'] = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: (amount: Record["amount"]) => {
            return (
              <>
                {Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                }).format(amount)}
              </> 
            );
          },
        },
        {
          title: 'Category',
          dataIndex: 'category_id',
          key: 'category_id',
          render: (category_id: string | number) => {
            const { name, color } = getCategoryDetails(String(category_id), categories);
            return <Tag color={color}>{name.toUpperCase()}</Tag>;
          },
        },
        {
          title: "Last Update",
          dataIndex: "updatedAt",
          key: "updatedAt",
          render: (updatedAt: string) => {
            const updatedAtObj = new Date(updatedAt);
            return (
              <>
                {updatedAtObj.toLocaleDateString()}{" "}
                {updatedAtObj.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
              </>
            );
          },
        },
        {
         title: 'Action',
         key: 'action',
         render: (_, record: Record) => {
          return(   
             <Space size="middle">
               <EditOutlined 
                 style={{ color: "#0390fc" }} 
                 onClick={() => {
                  showModal("edit");
                  setForm({ 
                    title: record.title, 
                    amount: record.amount, 
                    category_id: String(record.category_id),
                  });
                  setUpdateId(record.id);
                 }}
               />
               <DeleteOutlined 
                 style={{ color: "#c20808" }}
                 onClick={() => {
                  showModal("delete");
                  setDeleteId(record.id);                 
                 }}
               />
             </Space>
          )},
        },
    ];

  return (
    <React.Fragment>
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <Button type="primary" onClick={() => showModal("new")}>
                New Record
              </Button>
            </div>
            <Modal 
              title={mode === "new" ? "Create New Record" : mode === "edit" ? "Update Record" : "Delete Record"} 
              open={isModalOpen} 
              onOk={handleOk} 
              onCancel={handleCancel} 
              okButtonProps={{ disabled: !(mode === "delete") && !isFormValid }} 
            >
              {mode === "edit" || mode === "new" ? (
                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <Form.Item label="Title">
                    <Input 
                      name="title"
                      value={form.title} 
                      onChange={e => setForm({ ...form, title: e.target.value })} 
                    />
                  </Form.Item>
                  <Form.Item label="Amount">
                    <Input 
                      name="amount"
                      value={form.amount} 
                      onChange={e => setForm({ ...form, amount: Number(e.target.value) })} 
                    />
                  </Form.Item>
                  <Form.Item label="Category">
                    <Select 
                      value={String(form.category_id) || "0"}
                      onChange={(category_id) => setForm({ ...form, category_id: String(category_id) })}
                    >
                      <Select.Option value="0" disabled>Select a category</Select.Option>
                        {categories.map((category) => ( 
                            <Select.Option key={category.id} value={String(category.id)}>
                              {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                  </Form.Item> 
                </Form> 
              ) : mode === "delete" ? <>Are you sure?</> : null}                   
            </Modal>
        </div>
        <Table loading={loading} columns={columns} dataSource={data} rowKey="id" />
    </React.Fragment>   
  ); 
}

export default Records;