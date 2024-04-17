import Dexie from 'dexie'
let db;
chrome.runtime.onInstalled.addListener(() => {
    db = new Dexie("MyDatabase");
    db.version(1).stores({
        keywords: '++id, &name'
    });
    db.open().catch(function (e) {
        console.error("Open failed: " + e.stack);
    })

})
// ignore-ts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === "add") {
            db.keywords.put(request.data)
        } else if (request.type === "list") {

            db.keywords.toArray().then(keywords => {
                sendResponse(keywords)
            })
        } else if (request.type === "delete") {
            db.keywords.delete(request.data.id)
        } else if (request.type === "bulkAdd") {
            db.keywords.bulkAdd(request.data)
        }
        return true

    }
);