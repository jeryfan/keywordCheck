console.log("service-worker-starting");
const tableName = "name"
var db, objectStore, request;
chrome.runtime.onInstalled.addListener(() => {
    console.log("install");

    request = indexedDB.open("db", 4)
    request.onerror = function () {
        console.error("Error opening IndexedDB database.");
    };
    request.onsuccess = function (event) {
        db = event.target.result
        console.log("indexedDB loaded successfully");
    };
    request.onupgradeneeded = function (event) {
        db = event.target.result
        console.log("db", db);

        if (!db.objectStoreNames.contains(tableName)) {
            objectStore = db.createObjectStore(tableName, { keyPath: 'id' });
        }
        console.log("db.objectStoreNames", db.objectStoreNames);

    };

})

// 插入数据
function insert(name) {
    const transaction = db.transaction([tableName], 'readwrite');
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.add({ id: generateUniqueId(), name: name }); // 假设generateUniqueId生成唯一ID

    request.onsuccess = function (event) {
        console.log('Name inserted successfully', event.target.result);
    };
    request.onerror = function (event) {
        console.error('Error inserting name', event);
    };
}


function deleteOne(id) {
    const transaction = db.transaction([tableName], 'readwrite');
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.delete(id);

    request.onsuccess = function () {
        console.log('Name deleted successfully');
    };
    request.onerror = function (event) {
        console.error('Error deleting name', event);
    };
}

function list() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([tableName], 'readonly');
        const objectStore = transaction.objectStore(tableName);
        const request = objectStore.getAll();


        request.onsuccess = function (event) {
            console.log("event.target.result all", event.target.result);

            resolve(event.target.result ? event.target.result : null);
        };

        request.onerror = function (event) {
            reject('Error getting name by ID');
        };
    });
}

// ignore-ts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request, sender);

        if (request.type === "add") {
            console.log(request.data)
            insert(request.data)
        } else if (request.type === "list") {
            list().then(resp => {
                console.log("list", resp);

                sendResponse({ data: resp })
            })
        } else if (request.type === "delete") {
            console.log("delete", request.data);
            deleteOne(request.data.id)

        }
        return true

    }
);


function generateUniqueId() {
    const now = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000);
    return now.toString(36) + randomPart.toString(36);
}