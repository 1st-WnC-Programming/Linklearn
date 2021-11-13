import { doc, getDoc } from 'firebase/firestore';
import { db } from './fbase';
const getData = async (type, id) => {
  const result = [];
  let docRef = doc(db, `${type}`, `${id}`);
  let docSnap = await getDoc(docRef);
  let idx = id;
  while (docSnap.exists()) {
    result.push(docSnap.data());
    idx += 1;
    docRef = doc(db, `${type}`, `${idx}`);
    docSnap = await getDoc(docRef);
  }
  return result;
};

export default getData;
