const test = require('node:test');
const assert = require('node:assert/strict');

const linksRenderer = require('../js/links-renderer.js');

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.className = '';
    this.href = '';
    this.target = '';
    this.title = '';
    this.rel = '';
    this.textContent = '';
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  get childElementCount() {
    return this.children.length;
  }
}

class FakeDocument {
  constructor(container) {
    this.container = container;
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  getElementById(id) {
    return id === 'links-list' ? this.container : null;
  }
}

test('renderSecondaryLinks appends all links with target=_blank', () => {
  const container = new FakeElement('div');
  const documentRef = new FakeDocument(container);

  const count = linksRenderer.renderSecondaryLinks(
    container,
    [
      {
        linkTitle: 'There Is No Fold',
        linkURL: 'https://www.lukew.com/ff/entry.asp?1946',
        linkSource: 'lukew.com'
      },
      {
        linkTitle: 'As the Page Scrolls',
        linkURL: 'https://articles.uie.com/page_scrolling/',
        linkSource: 'articles.uie.com'
      }
    ],
    documentRef
  );

  assert.equal(count, 2);
  assert.equal(container.childElementCount, 2);

  for (const linkItem of container.children) {
    assert.equal(linkItem.className, 'link');
    const titleParagraph = linkItem.children[0];
    const anchor = titleParagraph.children[0];
    assert.equal(anchor.target, '_blank');
    assert.equal(anchor.rel, 'noopener noreferrer');
  }
});

test('loadSecondaryLinks consumes fetch response and renders links', async () => {
  const container = new FakeElement('div');
  const documentRef = new FakeDocument(container);

  const fetchImpl = async () => ({
    json: async () => ({
      secondaryLinks: [
        {
          linkTitle: 'Scrolling and Attention',
          linkURL: 'https://www.nngroup.com/articles/scrolling-and-attention/',
          linkSource: 'nngroup.com'
        }
      ]
    })
  });

  const renderedCount = await linksRenderer.loadSecondaryLinks({
    fetchImpl,
    documentRef,
    container
  });

  assert.equal(renderedCount, 1);
  assert.equal(container.childElementCount, 1);
  const sourceParagraph = container.children[0].children[1];
  assert.equal(sourceParagraph.textContent, 'nngroup.com');
});

test('renderSecondaryLinks skips invalid links and returns appended count', () => {
  const container = new FakeElement('div');
  const documentRef = new FakeDocument(container);
  const originalWarn = console.warn;
  const warnings = [];
  console.warn = (message) => warnings.push(message);

  try {
    const count = linksRenderer.renderSecondaryLinks(
      container,
      [
        {
          linkTitle: 'Valid link',
          linkURL: 'https://example.com',
          linkSource: 'example.com'
        },
        {
          linkURL: 'https://missing-title.com',
          linkSource: 'bad'
        },
        {
          linkTitle: 'Missing URL',
          linkSource: 'bad'
        },
        {
          linkTitle: '',
          linkURL: 'https://empty-title.com',
          linkSource: 'bad'
        }
      ],
      documentRef
    );

    assert.equal(count, 1);
    assert.equal(container.childElementCount, 1);
    assert.equal(warnings.length, 3);
  } finally {
    console.warn = originalWarn;
  }
});

test('renderSecondaryLinks applies empty source fallback when linkSource is missing', () => {
  const container = new FakeElement('div');
  const documentRef = new FakeDocument(container);

  const count = linksRenderer.renderSecondaryLinks(
    container,
    [
      {
        linkTitle: 'No source link',
        linkURL: 'https://example.com/no-source'
      }
    ],
    documentRef
  );

  assert.equal(count, 1);
  const sourceParagraph = container.children[0].children[1];
  assert.equal(sourceParagraph.textContent, '');
});
