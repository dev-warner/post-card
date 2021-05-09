# post-card 📬

[![Coverage Status](https://coveralls.io/repos/github/dev-warner/post-card/badge.svg?branch=main)](https://coveralls.io/github/dev-warner/post-card?branch=main)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](code_of_conduct.md)

`@dev-warner/post-card` is a small node library for generating OpenGraph images for social media sharing. 📬

- [Templates](https://github.com/dev-warner/post-card-templates)
- [Documentation](https://dev-warner.github.io/post-card/)

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
npm i @dev-warner/post-card -D
```

```typescript
import { PostCard } from '@dev-warner/post-card'

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

await PostCard.batch<{ title: string }>(
  Template,
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

> **WARNING: When batching lots of items it will take alot of time, and on CI machines can use a fair amount of RAM use the `options.concurrency` to configure to your needs**

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

### Styles

styles can come from three places. the template, the item and from the top level call. they get added in this level of importance.

-> root -> template -> item

```typescript
class Template {
  options = {
    styles: [`h1 { color: blue}`],
  }
}
await PostCard.create(
  Template,
  {
    output: '.tmp/image.jpg',
    data: {
      title: 'Hello World',
      options: { styles: [` h1 { color: green}`] },
    },
  },
  {
    styles: [`h1 { color: red }`],
  }
)
```

the output of `options.styles` sent to the browser will be

```css
h1 {
  color: red;
}
h1 {
  color: blue;
}
h1 {
  color: green;
}
```

### Template override

Sometimes you might not want the same template for each item but still want to batch them together.

```typescript
await PostCard.batch(Template, [
  { output: 'media/first-image.jpg', data: {} },
  {
    output: 'media/second-image.jpg',
    data: {},
    options: { templateOveride: FancyTemplate },
  },
])
```

## Creating Templates

Creating template is an easy process, by creating a class with a render function which returns a string which can also be a promise you can create your template any way you'd like.

For more information: [Templates](https://github.com/dev-warner/post-card-templates)

### Basic Example using EJS

```typescript
import ejs from 'ejs'

class BasicTemplate {
  options = {
    styles: [`h1 { color: red}`],
  }
  render(item) {
    return ejs.render(`<h1><%= title %></h1>`, item.data)
  }
}
```

### Images and Fonts

Because we're loading a browser it won't have access to your local images/fonts but there is a work around, which is to convert your images and fonts to base64 which i've provided a helper.

```js
import { Local } from '@dev-warner/post-card-templates'

class Template {
  options = {
    styles: [
      `
        html {
          font-family: url(${Local.font('./fonts/my-font.tff')});
        }
      `,
    ],
  }
  render(item) {
    return `
      <h1>${item.data.title}</h1>
      <img src="${Local.image(item.data.image)}" />
    `
  }
}
```

## Contributting Guide

Some resources:

- Our [CONTRIBUTING.md](CONTRIBUTING.md) to get started with setting up the repo.

- Our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) if you contribute i'd appreciate sticking to our code of conduct.

## License

[MIT](LICENSE)
