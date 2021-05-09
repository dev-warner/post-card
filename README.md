# post-card

[![test](https://github.com/dev-warner/post-card/actions/workflows/test.yml/badge.svg)](https://github.com/dev-warner/post-card/actions/workflows/test.yml)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](code_of_conduct.md)

`PostCard` is a small node library for generating OpenGraph images for social media sharing.

- [Templates]()
- [Documentation]()

<br>

## What is OpenGraph?

---

<br>

Simply as [opengraph.xyz](https://www.opengraph.xyz/) describes:

> Social networks and messaging apps use theOpen Graph meta tags to display your website.

- [Open Graph documentation](https://ogp.me/)
- [Open Graph card validator](https://www.opengraph.xyz/)

## Getting Started

```bash
npm i post-card -D
```

```typescript
import { PostCard } from 'post-card'

class Template {
  options = {
    styles: [
      `
       h1 {
        color: red;
       }
      `,
    ],
  }
  render(item) {
    return `<h1>${item.data.title}</h1>`
  }
}

await PostCard.create<{ title: string }>(new Template(), {
  output: 'media/home-page.png',
  data: {
    title: 'My great HomePage',
  },
})
```

## Create

Good for single use creation of a `Card`

> **WARNING: Would suggest against using this method if you're creating a lot of cards as it spins up a headless browser and closes for each call**

```typescript
await PostCard.create<{ title: string }>(
  Template,
  {
    output: 'media/home-page.png',
    data: {
      title: 'My great HomePage',
    },
  },
  {
    ...options,
  }
)
```

## Batch

Perfect for SSG usage as at build time you can create Open graph images for each Post/Page

```typescript
await PostCard.batch<{ title: string }>(
  Template,
  [
    {
      output: 'media/home-page.png',
      data: {
        title: 'My great HomePage',
      },
    },
  ],
  {
    concurrency: 10,
    ...options,
  }
)
```

## Configuration

### Template override

## Creating Templates

### Basic

## Contributting Guide

Some resources:

- Our [CONTRIBUTING.md](CONTRIBUTING.md) to get started with setting up the repo.

- Our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) if you contribute i'd appreciate sticking to our code of conduct.

## License

[MIT](LICENSE)
