import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, remove, set, push } from 'firebase/database';
import { firebaseConfig } from './fb-credentials';



export function inithw4DB() {
    initializeApp(firebaseConfig);
}

// (for demo purposes)
// export function writeData(key, data) {
//     const db = getDatabase();
//     const reference = ref(db, `hw4Data/${key}`);
//     set(reference, data);
// }

// store persistent data (automatically generated unique keys)
// note that it will store multiple of the same data
export function storeHistoryItem(item) {
    const db = getDatabase();
    const reference = ref(db, 'historyData/');
    push(reference, item);
  }
  
export function updateHistoryItem(itemData, itemKey) {
  const key = itemKey;
  // delete item.id;
  const db = getDatabase();
  const reference = ref(db, `historyData/${key}/state`);
  set(reference, itemData);
}

export function getHistoryItem(item) {
  const key = item.id;
  const db = getDatabase();
  const reference = ref(db, `historyData/${key}`);
  return(reference, item);
}

export function deleteHistoryItem(item) {
  const key = item.id;
  const db = getDatabase();
  const reference = ref(db, `historyData/${item.id}`);
  remove(reference);
}

export function setupHistoryListener( updateFunc ) {
  const db = getDatabase();
  const reference = ref(db, 'historyData/');
  onValue(reference, (snapshot) => {
    // console.log('setupHistoryListener fires up with: ', snapshot);
    if (snapshot?.val()) {
      const fbObject = snapshot.val();
      const newArr = [];
      Object.keys(fbObject).map((key, index) => {
        // console.log(key, '||', fbObject[key]);
        newArr.push({ ...fbObject[key], id: key });
      });
      updateFunc(newArr);
    } else {
      updateFunc([]);
    }
  });
}


