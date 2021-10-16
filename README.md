# PostCSS Color Classes

Generate color utility classes for text, background, and border.

Given the following rule `@color-classes $name, $color;` &mdash; where `$name` is the name of the class, and `$color` is the value of the color &mdash; it will produce the following classes:

```css
.color-$name { color: $color !important }
.bg-$name { background-color: $color !important }
.bd-$name { border-color: $color !important }
```

Example:

```css
@color-classes primary, var(--color-primary);
/* would produce: */
.color-primary { color: var(--color-primary) !important }
.bg-primary { background-color: var(--color-primary) !important }
.bd-primary { border-color: var(--color-primary) !important }
```

## Usage

Install plugin.

```bash
npm i @daltontan/postcss-color-classes
```

Add to you PostCSS config:

```js
module.exports = {
	plugins: [
		require('@daltontan/postcss-color-classes'),
	]
}
```

Add to your CSS file:

```css
@color-classes $name, $color;
```
