(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime/runtime-types.d.ts" />
/// <reference path="../../../shared/runtime/dev-globals.d.ts" />
/// <reference path="../../../shared/runtime/dev-protocol.d.ts" />
/// <reference path="../../../shared/runtime/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/components/Navbar.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "Navbar-module__nuAbfa__actions",
  "actionsOpen": "Navbar-module__nuAbfa__actionsOpen",
  "aiLink": "Navbar-module__nuAbfa__aiLink",
  "bar": "Navbar-module__nuAbfa__bar",
  "barOpen1": "Navbar-module__nuAbfa__barOpen1",
  "barOpen2": "Navbar-module__nuAbfa__barOpen2",
  "barOpen3": "Navbar-module__nuAbfa__barOpen3",
  "burger": "Navbar-module__nuAbfa__burger",
  "cta": "Navbar-module__nuAbfa__cta",
  "inner": "Navbar-module__nuAbfa__inner",
  "link": "Navbar-module__nuAbfa__link",
  "links": "Navbar-module__nuAbfa__links",
  "linksOpen": "Navbar-module__nuAbfa__linksOpen",
  "logo": "Navbar-module__nuAbfa__logo",
  "logoIcon": "Navbar-module__nuAbfa__logoIcon",
  "logoText": "Navbar-module__nuAbfa__logoText",
  "nav": "Navbar-module__nuAbfa__nav",
  "signIn": "Navbar-module__nuAbfa__signIn",
});
}),
"[project]/components/Navbar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/Navbar.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Navbar() {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nav,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inner,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logoIcon,
                            children: "🌍"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logoText,
                            children: "Planet Leads Academy"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Navbar.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].links} ${open ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].linksOpen : ''}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/courses",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].link,
                            onClick: ()=>setOpen(false),
                            children: "Courses"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/ai-tutor",
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].link} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].aiLink}`,
                            onClick: ()=>setOpen(false),
                            children: "🤖 AI Tutor"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 18,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/#features",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].link,
                            onClick: ()=>setOpen(false),
                            children: "Features"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/#pricing",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].link,
                            onClick: ()=>setOpen(false),
                            children: "Pricing"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Navbar.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actions} ${open ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionsOpen : ''}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://rayhymn.gumroad.com/",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].signIn,
                            children: "Sign In"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/courses",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cta,
                            onClick: ()=>setOpen(false),
                            children: "Get Started"
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Navbar.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].burger,
                    onClick: ()=>setOpen(!open),
                    "aria-label": "Toggle menu",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bar} ${open ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].barOpen1 : ''}`
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bar} ${open ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].barOpen2 : ''}`
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bar} ${open ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].barOpen3 : ''}`
                        }, void 0, false, {
                            fileName: "[project]/components/Navbar.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Navbar.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Navbar.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Navbar.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_s(Navbar, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/courses.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "courses",
    ()=>courses,
    "featuredCourses",
    ()=>featuredCourses
]);
const courses = [
    // Faith & Spirituality
    {
        id: "islamic-scholar",
        emoji: "☪️",
        title: "Islamic Scholar AI",
        category: "Faith & Spirituality",
        price: 49.99,
        description: "Deep dive into Islamic theology, jurisprudence, and Quranic studies with an AI-powered scholar companion.",
        gumroadLink: "https://rayhymn.gumroad.com/l/gfzkwx",
        featured: true
    },
    {
        id: "bible-scholar",
        emoji: "📖",
        title: "Bible Scholar AI",
        category: "Faith & Spirituality",
        price: 49.99,
        description: "Explore biblical texts, theology, and Christian history with an intelligent AI scholar as your guide.",
        gumroadLink: "https://rayhymn.gumroad.com/l/sydvnr",
        featured: true
    },
    {
        id: "torah-scholar",
        emoji: "📜",
        title: "Torah Scholar AI",
        category: "Faith & Spirituality",
        price: 49.99,
        description: "Study Torah, Talmud, and Jewish tradition with a knowledgeable AI tutor guiding your spiritual journey.",
        gumroadLink: "https://rayhymn.gumroad.com/l/xlcipm"
    },
    // Languages
    {
        id: "spanish",
        emoji: "🇪🇸",
        title: "Spanish",
        category: "Languages",
        price: 49.99,
        description: "Master conversational Spanish with AI-driven immersion techniques and real-time pronunciation feedback.",
        gumroadLink: "https://rayhymn.gumroad.com/l/fzycak",
        featured: true
    },
    {
        id: "french",
        emoji: "🇫🇷",
        title: "French",
        category: "Languages",
        price: 49.99,
        description: "Learn French from bonjour to fluency with adaptive AI lessons, cultural context, and live conversation practice.",
        gumroadLink: "https://rayhymn.gumroad.com/l/cidcgg"
    },
    {
        id: "mandarin",
        emoji: "🇨🇳",
        title: "Mandarin",
        category: "Languages",
        price: 49.99,
        description: "Conquer Mandarin tones, characters, and grammar with AI-guided spaced repetition and speaking practice.",
        gumroadLink: "https://rayhymn.gumroad.com/l/seebgl"
    },
    {
        id: "german",
        emoji: "🇩🇪",
        title: "German",
        category: "Languages",
        price: 49.99,
        description: "Tackle German grammar and build fluency for travel, business, or culture with intelligent AI guidance.",
        gumroadLink: "https://rayhymn.gumroad.com/l/dzuurr"
    },
    {
        id: "italian",
        emoji: "🇮🇹",
        title: "Italian",
        category: "Languages",
        price: 49.99,
        description: "Fall in love with the Italian language — vocabulary, pronunciation, and culture through AI-powered dialogue.",
        gumroadLink: "https://rayhymn.gumroad.com/l/cxvuc"
    },
    {
        id: "portuguese",
        emoji: "🇵🇹",
        title: "Portuguese",
        category: "Languages",
        price: 49.99,
        description: "Speak Brazilian or European Portuguese confidently with an AI tutor that adapts to your target dialect.",
        gumroadLink: "https://rayhymn.gumroad.com/l/lmsgrg"
    },
    {
        id: "japanese",
        emoji: "🇯🇵",
        title: "Japanese",
        category: "Languages",
        price: 49.99,
        description: "Learn hiragana, katakana, kanji, and natural Japanese conversation with personalized AI coaching.",
        gumroadLink: "https://rayhymn.gumroad.com/l/akfpsk"
    },
    {
        id: "korean",
        emoji: "🇰🇷",
        title: "Korean",
        category: "Languages",
        price: 49.99,
        description: "Master Hangul and Korean conversation through AI-powered lessons inspired by K-culture and everyday speech.",
        gumroadLink: "https://rayhymn.gumroad.com/l/imtdka"
    },
    {
        id: "arabic",
        emoji: "🇸🇦",
        title: "Arabic",
        category: "Languages",
        price: 49.99,
        description: "Learn Modern Standard Arabic and conversational dialects with script training and AI speaking practice.",
        gumroadLink: "https://rayhymn.gumroad.com/l/lrwwvs"
    },
    {
        id: "russian",
        emoji: "🇷🇺",
        title: "Russian",
        category: "Languages",
        price: 49.99,
        description: "Master Cyrillic, Russian grammar, and natural conversation with an AI tutor committed to your fluency.",
        gumroadLink: "https://rayhymn.gumroad.com/l/pbsszz"
    },
    // Music
    {
        id: "piano",
        emoji: "🎹",
        title: "Piano",
        category: "Music",
        price: 59.99,
        description: "From beginner to performer — learn piano with adaptive AI lessons, sheet music guidance, and instant feedback.",
        gumroadLink: "https://rayhymn.gumroad.com/l/lqgfhzl",
        featured: true
    },
    {
        id: "guitar",
        emoji: "🎸",
        title: "Guitar",
        category: "Music",
        price: 59.99,
        description: "Strum your way to mastery — chords, scales, and songs taught by an AI tutor that adapts to your skill level.",
        gumroadLink: "https://rayhymn.gumroad.com/l/mexiun",
        featured: true
    },
    {
        id: "music-theory",
        emoji: "🎼",
        title: "Music Theory",
        category: "Music",
        price: 59.99,
        description: "Understand the language of music — scales, harmony, rhythm, and composition with AI-powered interactive exercises.",
        gumroadLink: "https://rayhymn.gumroad.com/l/bhraet"
    },
    // Programming
    {
        id: "python",
        emoji: "🐍",
        title: "Python",
        category: "Programming",
        price: 59.99,
        description: "Learn Python from scratch to professional — data science, automation, and web dev with an AI coding mentor.",
        gumroadLink: "https://rayhymn.gumroad.com/l/jeqfxe",
        featured: true
    },
    {
        id: "javascript",
        emoji: "📜",
        title: "JavaScript",
        category: "Programming",
        price: 59.99,
        description: "Build dynamic web applications with JavaScript — from DOM manipulation to modern ES2024 with AI assistance.",
        gumroadLink: "https://rayhymn.gumroad.com/l/trxoo",
        featured: true
    },
    {
        id: "web-development",
        emoji: "🌐",
        title: "Web Development",
        category: "Programming",
        price: 59.99,
        description: "Build full-stack websites with HTML, CSS, and modern frameworks guided by an AI development coach.",
        gumroadLink: "https://rayhymn.gumroad.com/l/gxiyf"
    },
    {
        id: "mobile-development",
        emoji: "📱",
        title: "Mobile Development",
        category: "Programming",
        price: 59.99,
        description: "Create iOS and Android apps with React Native and AI-powered code review and architectural guidance.",
        gumroadLink: "https://rayhymn.gumroad.com/l/fidin"
    },
    // Business
    {
        id: "entrepreneurship",
        emoji: "🚀",
        title: "Entrepreneurship",
        category: "Business",
        price: 59.99,
        description: "Launch and grow your business with AI-guided strategies, market analysis frameworks, and startup playbooks.",
        gumroadLink: "https://rayhymn.gumroad.com/l/pihcm",
        featured: true
    },
    {
        id: "leadership",
        emoji: "👥",
        title: "Leadership Mastery",
        category: "Business",
        price: 59.99,
        description: "Develop executive leadership skills with AI-powered coaching, team dynamics strategies, and decision frameworks.",
        gumroadLink: "https://rayhymn.gumroad.com/l/extkgs",
        featured: true
    },
    {
        id: "data-analytics",
        emoji: "📈",
        title: "Data Analytics",
        category: "Business",
        price: 59.99,
        description: "Turn raw data into business insights using Excel, SQL, and visualization tools with AI-guided walkthroughs.",
        gumroadLink: "https://rayhymn.gumroad.com/l/dqevad"
    },
    {
        id: "project-management",
        emoji: "📋",
        title: "Project Management",
        category: "Business",
        price: 59.99,
        description: "Master Agile, Scrum, and PMP frameworks with AI-assisted scenario planning and real-world project simulations.",
        gumroadLink: "https://rayhymn.gumroad.com/l/hemree"
    },
    {
        id: "digital-marketing",
        emoji: "📊",
        title: "Digital Marketing",
        category: "Business",
        price: 59.99,
        description: "Drive growth with SEO, social media, email, and paid ads — all guided by an AI marketing strategist.",
        gumroadLink: "https://rayhymn.gumroad.com/l/zvhzb"
    }
];
const categories = [
    {
        id: "faith",
        emoji: "🙏",
        label: "Faith & Spirituality",
        courses: courses.filter((c)=>c.category === "Faith & Spirituality")
    },
    {
        id: "languages",
        emoji: "🗣️",
        label: "Languages",
        courses: courses.filter((c)=>c.category === "Languages")
    },
    {
        id: "music",
        emoji: "🎵",
        label: "Music",
        courses: courses.filter((c)=>c.category === "Music")
    },
    {
        id: "programming",
        emoji: "💻",
        label: "Programming",
        courses: courses.filter((c)=>c.category === "Programming")
    },
    {
        id: "business",
        emoji: "💼",
        label: "Business",
        courses: courses.filter((c)=>c.category === "Business")
    }
];
const featuredCourses = courses.filter((c)=>c.featured);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/ai-tutor.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "bounce": "ai-tutor-module__k6jN_a__bounce",
  "chatArea": "ai-tutor-module__k6jN_a__chatArea",
  "chatMessages": "ai-tutor-module__k6jN_a__chatMessages",
  "clearBtn": "ai-tutor-module__k6jN_a__clearBtn",
  "courseSelect": "ai-tutor-module__k6jN_a__courseSelect",
  "empty": "ai-tutor-module__k6jN_a__empty",
  "emptyIcon": "ai-tutor-module__k6jN_a__emptyIcon",
  "emptySub": "ai-tutor-module__k6jN_a__emptySub",
  "emptyTitle": "ai-tutor-module__k6jN_a__emptyTitle",
  "errorMsg": "ai-tutor-module__k6jN_a__errorMsg",
  "fadeUp": "ai-tutor-module__k6jN_a__fadeUp",
  "input": "ai-tutor-module__k6jN_a__input",
  "inputArea": "ai-tutor-module__k6jN_a__inputArea",
  "inputHint": "ai-tutor-module__k6jN_a__inputHint",
  "inputWrap": "ai-tutor-module__k6jN_a__inputWrap",
  "main": "ai-tutor-module__k6jN_a__main",
  "message": "ai-tutor-module__k6jN_a__message",
  "msgAvatar": "ai-tutor-module__k6jN_a__msgAvatar",
  "msgBubble": "ai-tutor-module__k6jN_a__msgBubble",
  "msgContent": "ai-tutor-module__k6jN_a__msgContent",
  "msgRole": "ai-tutor-module__k6jN_a__msgRole",
  "page": "ai-tutor-module__k6jN_a__page",
  "select": "ai-tutor-module__k6jN_a__select",
  "selectLabel": "ai-tutor-module__k6jN_a__selectLabel",
  "sendBtn": "ai-tutor-module__k6jN_a__sendBtn",
  "sendDisabled": "ai-tutor-module__k6jN_a__sendDisabled",
  "sidebar": "ai-tutor-module__k6jN_a__sidebar",
  "sidebarInner": "ai-tutor-module__k6jN_a__sidebarInner",
  "sidebarSub": "ai-tutor-module__k6jN_a__sidebarSub",
  "sidebarTitle": "ai-tutor-module__k6jN_a__sidebarTitle",
  "suggestedLabel": "ai-tutor-module__k6jN_a__suggestedLabel",
  "suggestedSection": "ai-tutor-module__k6jN_a__suggestedSection",
  "suggestion": "ai-tutor-module__k6jN_a__suggestion",
  "suggestions": "ai-tutor-module__k6jN_a__suggestions",
  "typing": "ai-tutor-module__k6jN_a__typing",
  "userMsg": "ai-tutor-module__k6jN_a__userMsg",
});
}),
"[project]/pages/ai-tutor.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AITutorPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Navbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$courses$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/courses.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/pages/ai-tutor.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const SUGGESTED = [
    'Explain the pillars of Islam',
    'Teach me basic Spanish phrases',
    'How do I start learning Python?',
    'What are the fundamentals of music theory?',
    'Give me a business idea to start today',
    'Help me understand JavaScript promises',
    'What are the best leadership qualities?',
    'How do I learn piano as a beginner?'
];
function AITutorPage() {
    _s();
    const [selectedCourse, setSelectedCourse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('general');
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AITutorPage.useEffect": ()=>{
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["AITutorPage.useEffect"], [
        messages,
        loading
    ]);
    const getCourseContext = ()=>{
        if (selectedCourse === 'general') return 'general learning across all subjects';
        const c = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$courses$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["courses"].find((c)=>c.id === selectedCourse);
        return c ? `${c.title} (${c.category})` : 'general learning';
    };
    const sendMessage = async (text)=>{
        const userText = (text || input).trim();
        if (!userText || loading) return;
        const newMessages = [
            ...messages,
            {
                role: 'user',
                content: userText
            }
        ];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        setError('');
        const systemPrompt = `You are an expert AI tutor for Planet Leads Academy, a premium online learning platform based in Brooklyn, NY. You are currently helping a student focused on: ${getCourseContext()}.

Your role:
- Teach clearly with examples, analogies, and step-by-step breakdowns
- Be encouraging and supportive — students learn best when they feel confident
- Adapt your depth to the student's apparent level based on their questions
- Use formatting (numbered lists, bullet points) where it helps clarity
- When relevant, mention that Planet Leads Academy has a full course on this topic at https://planet-leads-academy.netlify.app/courses
- Keep responses focused and actionable — no fluff

Planet Leads Academy offers 25 AI-powered courses across: Faith & Spirituality (Islamic Scholar AI, Bible Scholar AI, Torah Scholar AI), Languages (Spanish, French, Mandarin, Japanese, Korean, Portuguese, German, Italian, Arabic, Russian), Music (Piano, Guitar, Music Theory), Programming (Python, JavaScript, Web Development, Mobile Development), and Business (Entrepreneurship, Leadership Mastery, Data Analytics, Project Management, Digital Marketing).`;
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: newMessages,
                    system: systemPrompt
                })
            });
            if (!response.ok) {
                const data = await response.json().catch(()=>({}));
                throw new Error(data.error || 'Failed to get response');
            }
            const data = await response.json();
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: data.content
                }
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally{
            setLoading(false);
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const clearChat = ()=>{
        setMessages([]);
        setError('');
        inputRef.current?.focus();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "AI Tutor — Planet Leads Academy"
                    }, void 0, false, {
                        fileName: "[project]/pages/ai-tutor.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Chat with your personal AI tutor powered by Planet Leads Academy. Ask anything about any of our 25 courses."
                    }, void 0, false, {
                        fileName: "[project]/pages/ai-tutor.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/pages/ai-tutor.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/ai-tutor.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/pages/ai-tutor.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sidebar,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sidebarInner,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sidebarTitle,
                                            children: "🤖 AI Tutor"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/ai-tutor.tsx",
                                            lineNumber: 116,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sidebarSub,
                                            children: "Select a course topic to get personalized guidance"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/ai-tutor.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].courseSelect,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectLabel,
                                                    children: "Focus Area"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/ai-tutor.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].select,
                                                    value: selectedCourse,
                                                    onChange: (e)=>setSelectedCourse(e.target.value),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "general",
                                                            children: "✨ General Learning"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/ai-tutor.tsx",
                                                            lineNumber: 126,
                                                            columnNumber: 19
                                                        }, this),
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$courses$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["courses"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: c.id,
                                                                children: [
                                                                    c.emoji,
                                                                    " ",
                                                                    c.title
                                                                ]
                                                            }, c.id, true, {
                                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                                lineNumber: 128,
                                                                columnNumber: 21
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/ai-tutor.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/ai-tutor.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].suggestedSection,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].suggestedLabel,
                                                    children: "Try asking:"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/ai-tutor.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].suggestions,
                                                    children: SUGGESTED.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].suggestion,
                                                            onClick: ()=>sendMessage(s),
                                                            disabled: loading,
                                                            children: s
                                                        }, s, false, {
                                                            fileName: "[project]/pages/ai-tutor.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/ai-tutor.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/ai-tutor.tsx",
                                            lineNumber: 135,
                                            columnNumber: 15
                                        }, this),
                                        messages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].clearBtn,
                                            onClick: clearChat,
                                            children: "🗑 Clear Conversation"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/ai-tutor.tsx",
                                            lineNumber: 152,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/ai-tutor.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/ai-tutor.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chatArea,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chatMessages,
                                        children: [
                                            messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].empty,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].emptyIcon,
                                                        children: "🤖"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].emptyTitle,
                                                        children: "Your AI Tutor is Ready"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].emptySub,
                                                        children: [
                                                            "Ask me anything about any subject — I'm here to help you learn and grow.",
                                                            selectedCourse !== 'general' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    " Currently focused on: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$courses$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["courses"].find((c)=>c.id === selectedCourse)?.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                                        lineNumber: 168,
                                                                        columnNumber: 48
                                                                    }, this)
                                                                ]
                                                            }, void 0, true)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                lineNumber: 162,
                                                columnNumber: 17
                                            }, this),
                                            messages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].message} ${msg.role === 'user' ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].userMsg : __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].aiMsg}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msgAvatar,
                                                            children: msg.role === 'user' ? '👤' : '🤖'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/ai-tutor.tsx",
                                                            lineNumber: 179,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msgBubble,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msgRole,
                                                                    children: msg.role === 'user' ? 'You' : 'AI Tutor'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/ai-tutor.tsx",
                                                                    lineNumber: 183,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msgContent,
                                                                    dangerouslySetInnerHTML: {
                                                                        __html: formatMessage(msg.content)
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/ai-tutor.tsx",
                                                                    lineNumber: 186,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/ai-tutor.tsx",
                                                            lineNumber: 182,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/pages/ai-tutor.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 17
                                                }, this)),
                                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].message} ${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].aiMsg}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msgAvatar,
                                                        children: "🤖"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msgBubble,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].msgRole,
                                                                children: "AI Tutor"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].typing,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                                        lineNumber: 200,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                                        lineNumber: 200,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                                        lineNumber: 200,
                                                                        columnNumber: 39
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                                lineNumber: 199,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                lineNumber: 195,
                                                columnNumber: 17
                                            }, this),
                                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorMsg,
                                                children: [
                                                    "⚠️ ",
                                                    error
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                ref: bottomRef
                                            }, void 0, false, {
                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                lineNumber: 212,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/ai-tutor.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputArea,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrap,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        ref: inputRef,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].input,
                                                        placeholder: "Ask your AI tutor anything… (Enter to send, Shift+Enter for newline)",
                                                        value: input,
                                                        onChange: (e)=>setInput(e.target.value),
                                                        onKeyDown: handleKeyDown,
                                                        rows: 1,
                                                        disabled: loading
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sendBtn} ${loading || !input.trim() ? __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sendDisabled : ''}`,
                                                        onClick: ()=>sendMessage(),
                                                        disabled: loading || !input.trim(),
                                                        "aria-label": "Send message",
                                                        children: loading ? '⏳' : '➤'
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/ai-tutor.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                lineNumber: 216,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ai$2d$tutor$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputHint,
                                                children: "Powered by Claude AI · Planet Leads Academy"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/ai-tutor.tsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/ai-tutor.tsx",
                                        lineNumber: 215,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/ai-tutor.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/ai-tutor.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/ai-tutor.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(AITutorPage, "TPOOg2k8CV+9EeMCW1FZpltB2Ks=");
_c = AITutorPage;
function formatMessage(text) {
    return text// Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')// Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')// Code blocks
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')// Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')// Numbered lists
    .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')// Bullet lists
    .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')// Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (m)=>`<ul>${m}</ul>`)// Headers
    .replace(/^###\s(.+)$/gm, '<h4>$1</h4>').replace(/^##\s(.+)$/gm, '<h3>$1</h3>').replace(/^#\s(.+)$/gm, '<h2>$1</h2>')// Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')// Line breaks
    .replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/^(.+)$/, '<p>$1</p>');
}
var _c;
__turbopack_context__.k.register(_c, "AITutorPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/ai-tutor.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/ai-tutor";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/ai-tutor.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if ("TURBOPACK compile-time truthy", 1) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/ai-tutor\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/ai-tutor.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__04xou63._.js.map