import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Category, CategoryDispatch, CategoryForm } from "../../types/category";

// Kategorileri Getir (Firestore'dan)
export const getCategories = () => async (dispatch: CategoryDispatch) => {
    dispatch({ type: "GET_CATEGORIES_START" });

    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categories: Category[] = querySnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id.toString(),
                name: data.name?.replace(/['"]+/g, '') || "Unnamed",
                type: data.type?.replace(/['"]+/g, '') ?? "expense",
                color: data.color ?? "black"
            };
        });
        console.log("Güncellenmiş Kategoriler:", categories);

        dispatch({ type: "GET_CATEGORIES_SUCCESS", payload: categories });
    } catch (error) {
        dispatch({ type: "GET_CATEGORIES_ERROR" });
        console.error("Kategori çekme hatası:", error);
    }
};

// Yeni Kategori Ekle
export const addCategory = (form: CategoryForm) => async (dispatch: CategoryDispatch) => {
    dispatch({ type: "ADD_CATEGORY_START" });

    try {
        const docRef = await addDoc(collection(db, "categories"), {
            ...form,
            type: form.type ?? "expense",
            color: form.color ?? "black"
        });
        
        const newCategory: Category = {
            id: docRef.id.toString(),
            name: form.name.replace(/['"]+/g, ''),
            type: form.type ?? "expense",
            color: form.color ?? "black"
        }

        dispatch({ type: "ADD_CATEGORY_SUCCESS", payload: newCategory });
    } catch (error) {
        console.error("Kategori ekleme hatası:", error);
        dispatch({ type: "ADD_CATEGORY_ERROR" });
    }
};

// Kategori Güncelle
export const updateCategory = (form: Partial<CategoryForm>, categoryId: string) => async (dispatch: CategoryDispatch) => {
    dispatch({ type: "UPDATE_CATEGORY_START" });

    try {
        const categoryRef = doc(db, "categories", categoryId);
        await updateDoc(categoryRef, form);

        const updatedCategory: Category = {
            id: categoryId.toString(),
            name: form.name ?? "", 
            type: form.type ?? "expense", 
            color: form.color ?? "black" 
        };

        dispatch({ type: "UPDATE_CATEGORY_SUCCESS", payload: updatedCategory });
    } catch (error) {
        console.error("Kategori güncelleme hatası:", error);
        dispatch({ type: "UPDATE_CATEGORY_ERROR" });
    }
};

// Kategori Sil
export const deleteCategory = (categoryId: string) => async (dispatch: CategoryDispatch) => {
    dispatch({ type: "DELETE_CATEGORY_START" });

    try {
        const categoryRef = doc(db, "categories", categoryId);
        await deleteDoc(categoryRef);

        dispatch({ type: "DELETE_CATEGORY_SUCCESS", payload: categoryId });
    } catch (error) {
        console.error("Kategori silme hatası:", error);
        dispatch({ type: "DELETE_CATEGORY_ERROR" });
    }
};