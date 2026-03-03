(function (global) {
  'use strict';

  function createLinkItem(documentRef, link) {
    var linkItem = documentRef.createElement('div');
    linkItem.className = 'link';

    var titleParagraph = documentRef.createElement('p');
    titleParagraph.className = 'link-title';

    var anchor = documentRef.createElement('a');
    anchor.href = link.linkURL;
    anchor.target = '_blank';
    anchor.title = link.linkTitle;
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.linkTitle + ' →';

    titleParagraph.appendChild(anchor);

    var sourceParagraph = documentRef.createElement('p');
    sourceParagraph.className = 'link-source';
    sourceParagraph.textContent = link.linkSource;

    linkItem.appendChild(titleParagraph);
    linkItem.appendChild(sourceParagraph);

    return linkItem;
  }

  function renderSecondaryLinks(container, links, documentRef) {
    if (!container) {
      throw new Error('Links container was not found.');
    }

    var safeLinks = Array.isArray(links) ? links : [];
    var doc = documentRef || global.document;

    safeLinks.forEach(function (link) {
      container.appendChild(createLinkItem(doc, link));
    });

    return container.childElementCount;
  }

  function loadSecondaryLinks(options) {
    var opts = options || {};
    var fetchImpl = opts.fetchImpl || global.fetch;
    var documentRef = opts.documentRef || global.document;
    var container = opts.container || documentRef.getElementById('links-list');

    return fetchImpl('js/links.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return renderSecondaryLinks(container, data.secondaryLinks, documentRef);
      });
  }

  global.AboveTheFoldLinks = {
    loadSecondaryLinks: loadSecondaryLinks,
    renderSecondaryLinks: renderSecondaryLinks
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.AboveTheFoldLinks;
  }
})(typeof window !== 'undefined' ? window : globalThis);
