import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Record, RecordDispatch, RecordForm } from "../../types/record";
import { db } from "../../firebase";
import { RootState } from "..";

// Kayıtları getir
export const getRecords = () => async ( dispatch: RecordDispatch) => {
    dispatch({ type: "GET_RECORDS_START"});
    try {
        const querySnapshot = await getDocs(collection(db, "records"));
        const records: Record[] = querySnapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data() as Omit<Record, "id">;
            return { 
                id: docSnapshot.id,
                ...data,
                category_id: String(data.category_id)
            };
        });

        // createdAt alanına göre sıralama
        records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        dispatch({ type: "GET_RECORDS_SUCCESS", payload: records });
    } catch {
        dispatch({ type: "GET_RECORDS_ERROR" });
    }
};
// Yeni Kayıt Ekle
export const addRecord = (form: RecordForm) => async (dispatch: RecordDispatch) => {
    dispatch({ type: "ADD_RECORD_START" });
    try {
        const recordData = {
            ...form,
            category_id: String(form.category_id),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, "records"), recordData);

        const newRecord: Record = { id: docRef.id, ...recordData };
        dispatch({ type: "ADD_RECORD_SUCCESS", payload: newRecord });
    } catch {
        dispatch({ type: "ADD_RECORD_ERROR" });
    }
};
// Kayıt Güncelle
export const updateRecord = (form: Partial<RecordForm>, id: string) => async (dispatch: RecordDispatch, getState: () => RootState) => {
    dispatch({ type: "UPDATE_RECORD_START" });
    try {
        // Firebase'deki ilgili dokümanı referans olarak al
        const recordRef = doc(db, "records", id);

        // Mevcut kaydı state'ten bul
        const existingRecord = getState().records.data.find((record) => record.id === id);

        if (!existingRecord) throw new Error("Record not found");

        const updatedRecord = {
            ...existingRecord,   
            ...form, 
            category_id: String(form.category_id) || existingRecord.category_id,
            updatedAt: new Date().toISOString(),
        };

        await updateDoc(recordRef, updatedRecord);

        dispatch({ type: "UPDATE_RECORD_SUCCESS", payload: updatedRecord });
    } catch (error) {
        console.error("Update error:", error);
        dispatch({ type: "UPDATE_RECORD_ERROR" });
    }
};
// Kayıt Sil
export const deleteRecord = (id: string) => async (dispatch: RecordDispatch) => {
    dispatch({ type: "DELETE_RECORD_START" });
    try {
        await deleteDoc(doc(db, "records", id));
        dispatch({ type: "DELETE_RECORD_SUCCESS", payload: id });
    } catch {
        dispatch({ type: "DELETE_RECORD_ERROR" });
    }
};