import { doc, getDocs, collection, query } from 'firebase/firestore';
import { db } from './fbase';
const getData = async (type) => {
  const result = [];
  // let docRef = doc(db, `${type}`, `${id}`)
  let docRef = query(collection(db, `${type}`));
  let querySnapshot = await getDocs(docRef);
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
};

export default getData;
