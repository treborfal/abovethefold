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
    sourceParagraph.textContent = typeof link.linkSource === 'string' ? link.linkSource : '';

    linkItem.appendChild(titleParagraph);
    linkItem.appendChild(sourceParagraph);

    return linkItem;
  }

  function isRenderableLink(link) {
    return (
      link &&
      typeof link.linkTitle === 'string' &&
      link.linkTitle.length > 0 &&
      typeof link.linkURL === 'string' &&
      link.linkURL.length > 0
    );
  }

  function shouldWarnForSkippedLinks() {
    return (
      typeof global.process !== 'undefined' &&
      global.process &&
      global.process.env &&
      global.process.env.NODE_ENV !== 'production'
    );
  }

  function renderSecondaryLinks(container, links, documentRef) {
    if (!container) {
      throw new Error('Links container was not found.');
    }

    var safeLinks = Array.isArray(links) ? links : [];
    var doc = documentRef || global.document;

    var appendedCount = 0;

    safeLinks.forEach(function (link, index) {
      if (!isRenderableLink(link)) {
        if (shouldWarnForSkippedLinks() && global.console && typeof global.console.warn === 'function') {
          global.console.warn('Skipping invalid secondary link at index ' + index + '.', link);
        }
        return;
      }

      container.appendChild(createLinkItem(doc, link));
      appendedCount += 1;
    });

    return appendedCount;
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
