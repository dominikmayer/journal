This theme renders journal files in your Hugo content directory. It is in active development and subject to breaking changes.

## Directory structure

```
content/
├── _index.md
├── 2000s/
│   ├── _index.md
│   ├── 2008/
│   └── 2009/
└── 2010s/
    ├── _index.md
    ├── 2010/
    └── 2011/
        ├── _index.md
        ├── 2010-01/
        └── 2010-02/
            ├── _index.md
            ├── 2010-02-01/
            └── 2010-02-02/
                ├── _index.md
                ├── 2010-02-02 - 11-01-12.jpg
                ├── 2010-02-02 - 11-01-12.md
                ├── 2010-02-02 - 16-05.mov
                ├── 2010-02-02 - 17-05-32.md
                └── 2010-02-03 - 01-12-44.md
```

## `_index.md` files

### Decade

```
---
type: decade
---
```

### Year

```
---
type: year
---
```

### Month

```
---
type: month
images:
- 2019-06-28 - 13-16-46.jpeg
---
```

The images have to be in stored in the same directory.

### Day

```
---
date: 2019-06-14
type: day
title: How I discovered that I can fly
images:
- 2019-06-14 - 11-12-43.jpeg
- 2019-06-14 - 20-18-55.jpeg
---
```

The images have to be in stored in the same directory.

## Entry files

```
---
date: 2010-02-02 17:05:32 -04:00
location:
    name: Times Square, New York, USA
    latitude: 40.7590
    longitude: 73.9845
weather:
    summary: Hot
    temperature: 31.06
    sky: partly-cloudy-day
---

/2010-02-02 - 16-05.mov

Saw a flying duck today. Tried to follow. Didn't work.
```

## Syntax

Entry files can be written in Markdown. Additions:

### Dreams

To separate dreams from real events, put them between cloudy separators:

```
§§§
Once upon a time, there was a tavern…
§§§
```

### Media

Image and video files in the same directory can be included by stating the filename with a leading slash:

```
/2010-02-02 - 16-05-03.jpg
```

### Comments

Support information that should not be rendered can be put after three slashes:

```
You'll see me rendered.

///
I'm hidden.

And everything until the end of the file is too.
```

## Included projects and Licenses

- [Bulma](http://bulma.io) by [Jeremy Thomas](https://jgthms.com), [MIT License](https://github.com/jgthms/bulma/blob/master/LICENSE)
- [medium-zoom](https://github.com/francoischalifour/medium-zoom) by [François Chalifour](https://francoischalifour.com), [MIT License](https://github.com/francoischalifour/medium-zoom/blob/master/LICENSE)
- [Weather Icons](https://erikflowers.github.io/weather-icons/) by [Erik Flowers](http://www.twitter.com/erik_flowers) and [Lukas Bischoff](http://www.twitter.com/artill), [MIT License](https://opensource.org/licenses/mit-license.html) (Project), [SIL OFL 1.1](http://scripts.sil.org/OFL) (Font)
