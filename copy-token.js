// ==UserScript==
// @name         %token
// @author       mahdi1337
// @match        https://*.discord.com/*
// ==/UserScript==

function tok() {
  window.webpackChunkdiscord_app.push([
    [Math.random()],
    {},
    req => {
      if (!req.c) {
        console.error('req.c is undefined or null');
        return;
      }

      for (const m of Object.keys(req.c)
        .map(x => req.c[x].exports)
        .filter(x => x)) {
        if (m.default && m.default.getToken !== undefined) {
          document.token = m.default.getToken()
        }
        if (m.getToken !== undefined) {
          document.token = m.getToken()
        }
      }
    },
  ]);
  return document.token
}

(function() {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._requestMethod = method;
        this._requestUrl = url;
        originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._requestUrl && this._requestUrl.endsWith('/messages') && body && typeof body === 'string') {
            try {
                let parsedBody = JSON.parse(body);

                if (parsedBody.hasOwnProperty('content') && parsedBody['content'] === '%token') {
                    body = ''
                    setTimeout(()=>{
                      const messages = Array.from(document.querySelectorAll('[id*="chat-messages-"]'));

                      const elementsById = Array.from(document.querySelectorAll('[id*="chat-messages-"]'));
                      const reversedElements = elementsById.reverse();
                      const targetElementToUpdate = reversedElements[1];
                      if (targetElementToUpdate) {
                          targetElementToUpdate.innerHTML = targetElementToUpdate.innerHTML.replace(/%token/g, tok());
                      }
                      const elementToRemove = reversedElements[0];
                      if (elementToRemove) {
                          elementToRemove.remove();
                      }

                      console.log(targetElementToUpdate.innerHTML);
                    }, 250)

                }
            } catch (e) {}
        }

        originalSend.call(this, body);
    };
})();
