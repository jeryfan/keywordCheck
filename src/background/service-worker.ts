import Dexie from 'dexie'


console.log("service-worker-starting");
var db
chrome.runtime.onInstalled.addListener(() => {
    db = new Dexie("MyDatabase");
    db.version(1).stores({
        keywords: '++id, &name'
    });
    db.open().catch(function(e) {
        console.error("Open failed: " + e.stack);
    })

})
// ignore-ts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request, sender);
        if (request.type === "add") {
            db.keywords.put(request.data)
        } else if (request.type === "list") {
            
            db.keywords.toArray().then(keywords=>{
                console.log("users",keywords);
                sendResponse(keywords)
            })
        } else if (request.type === "delete") {
            db.keywords.delete(request.data.id)
        }
        return true

    }
);