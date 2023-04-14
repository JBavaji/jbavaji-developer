'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "11e1a177d57c5da2bc6e3a6acc3010f4",
"index.html": "33fde0e87e196578346e87af921a2b5d",
"/": "33fde0e87e196578346e87af921a2b5d",
"main.dart.js": "8ee1905f9eab24fb28f0a027f1877c3b",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"favicon.png": "30e6fa77a8040b6aa12d821c449bcd22",
"icons/Icon-192.png": "492026e1d29e1ba172c0fdff73680831",
"icons/Icon-maskable-192.png": "492026e1d29e1ba172c0fdff73680831",
"icons/Icon-maskable-512.png": "0801262ba7d8d4a9089a4678959e4dfc",
"icons/Icon-512.png": "0801262ba7d8d4a9089a4678959e4dfc",
"manifest.json": "d9fe8341a5f66fd6921188b65962dd85",
"assets/AssetManifest.json": "48520271ec49016179f22cc07e2d7803",
"assets/NOTICES": "f660e7159efed1a648ca64f908a1b055",
"assets/FontManifest.json": "f77e201f4b31d367e39b77bb3bbfa04e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "9cda082bd7cc5642096b56fa8db15b45",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "0a94bab8e306520dc6ae14c2573972ad",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b00363533ebe0bfdb95f3694d7647f6d",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/technology/flutter.png": "cf38e11b1bbaf3034d7f594863e51775",
"assets/assets/technology/github.png": "b0b4bdb682ac1e625267bcca30785fb7",
"assets/assets/technology/firebase.png": "65aaede495edb9cb9e213da4f23da5cb",
"assets/assets/technology/java.png": "2916033100acfb5548c4dbf13473fb9a",
"assets/assets/technology/sourcetree.png": "91182bc395956734cea092926a3a1688",
"assets/assets/technology/javascript.png": "7b5965c2505b9e12e7e04b8ea2a581af",
"assets/assets/technology/react_native.png": "9e4b4026e8c37c481ff584632f5d59d2",
"assets/assets/technology/figma.png": "cd85a31c650be947803f1d20ba695ed6",
"assets/assets/technology/postgresql.png": "f1578d412f7ad2cbf86541d1b0cbf2d4",
"assets/assets/technology/solana.png": "4c0f743ba85494b9b4be91629474b396",
"assets/assets/technology/mysql.png": "b2b17030750b6568f052c55e7fd7acb1",
"assets/assets/technology/reactjs.png": "0a095263b8baaeaa4fa7ae2de1e1d816",
"assets/assets/technology/couchdb.png": "98bf22dd073ac5c459ede59d60bebaa8",
"assets/assets/technology/sketch.png": "45fb165b9ddfb001fccd4bc6ddf4e9ab",
"assets/assets/technology/mongodb.png": "b7690f8b0897effb0e4b9b6cbe1f660e",
"assets/assets/technology/kotlin.png": "5d2bccdf39b9cad761588ca3fca76300",
"assets/assets/images/landing.jpg": "28013fb7f506485745afdcaf4714ccf0",
"assets/assets/images/app_logo.png": "9b0f4a5d82c1738ba3592855d8b9aced",
"assets/assets/fonts/Quicksand-Bold.ttf": "517b4a8fa3577cc7066e9bcfebe4beff",
"assets/assets/fonts/Quicksand-Regular.ttf": "3dfedd2b3e7b35ec3ac8a295a166a880",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
