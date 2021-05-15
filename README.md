# post-cards 📬

[![Coverage Status](https://coveralls.io/repos/github/dev-warner/post-card/badge.svg?branch=main)](https://coveralls.io/github/dev-warner/post-card?branch=main)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](code_of_conduct.md)

`@post-cards/core` is a small node library for generating OpenGraph images for social media sharing. 📬

- [Templates](https://github.com/dev-warner/post-card-templates)
- [Documentation](https://dev-warner.github.io/post-card/)

<br>

## What is OpenGraph?

---

<br>

Simply as [opengraph.xyz](https://www.opengraph.xyz/) describes:

> Social networks and messaging apps use the Open Graph meta tags to display your website.

- [Open Graph documentation](https://ogp.me/)
- [Open Graph card validator](https://www.opengraph.xyz/)

## Getting Started

```bash
npm i @post-cards/core -D
```

```typescript
import generate from '@post-cards/core'
import BasicTemplate from '@post-cards/basic-template'

await generate(
  new BasicTemplate({
    text: '#fff',
    background: '#000',
    accent: 'orange',
  }),
  [
    {
      output: 'media/home-page.png',
      data: {
        title: 'My great Home Page',
      },
    },
    {
      output: 'media/about-page.png',
      data: {
        title: 'My great About Page',
      },
    },
  ],
  {
    concurrency: 10,
    ...options,
  }
)
```

### Template override

Sometimes you might not want the same template for each item but still want to batch them together.

```typescript
await generate(Template, [
  { output: 'media/first-image.jpg', data: {} },
  {
    output: 'media/second-image.jpg',
    data: {},
    options: { templateOveride: FancyTemplate },
  },
])
```

## Creating Templates

Creating template is an easy process, if you've ever worked with html canvas, creating templates should be a breeze, and we provide some utils to smooth out the process.

For more information: [Templates](https://github.com/dev-warner/post-card-templates)

## Contributting Guide

Some resources:

- Our [CONTRIBUTING.md](CONTRIBUTING.md) to get started with setting up the repo.

- Our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) if you contribute i'd appreciate sticking to our code of conduct.

## License

[MIT](LICENSE)
