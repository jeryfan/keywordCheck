console.log("service-worker");
let db;
chrome.runtime.onInstalled.addListener(() => {
    const request = indexedDB.open("db")
    request.onerror = function () {
        console.error("Error opening IndexedDB database.");
    };
    request.onsuccess = function (event) {
        const target: IDBOpenDBRequest = event.target as IDBOpenDBRequest;
        db = target?.result
        console.log("indexedDB loaded successfully");
        const keys = db.createObjectStore("keywords", { keyPath: "name" })
    };
    request.onupgradeneeded = function () {
        console.log("upgradeneeded");
    };

})