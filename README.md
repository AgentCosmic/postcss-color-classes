# PostCSS Color Classes

Generate custom properties (variables) and classes for text, background, and border.

The syntax for the plugin is:
```
@generate-color <name> <color> [{
	<variation>: <tint(0-100)|shade(0-100)|alpha(0-1)|desaturate(0-100)|saturate(0-100)|no-color|no-bg|no-bd|no-var...>
    ...
}];
```

Each at-rule is used to define a color and its variations. The parameter accepted is the name of the color followed by
the color code. The declarations in the body is used to define the color variations you want. The name will be used as
the postfix. The accepted values are as follows:

- **tint()** - make the color brighter.
- **shade()** - make the color darker.
- **alpha()** - set the alpha channel.
- **desaturate()** - decrease saturation.
- **saturate()** - increase saturation.
- **no-color** - disable generating the color class.
- **no-bg** - disable generating the background class.
- **no-bd** - disable generating the border class.
- **no-var** - disable generating the custom property (variable).

## Example

Input:
```css
@generate-color primary #013370 {
	light: tint(1);
	shadow: shade(2) alpha(0.2) no-bg no-color no-bd;
}
```

Output:
```css
:root {
    --color-primary: #013370;
    --color-primary-light: #013575;
    --color-primary-light-rgb: 1 53 117;
    --color-primary-shadow: rgba(1, 49, 107, 0.2)
    --color-primary-shadow-rgb: 1 49 107;
}
.color-primary {
    color: #013370 !important
}
.bg-primary {
    background-color: #013370 !important
}
.bd-primary {
    border-color: #013370 !important
}
.color-primary-light {
    color: #013575 !important
}
.bg-primary-light {
    background-color: #013575 !important
}
.bd-primary-light {
    border-color: #013575 !important
}
.bd-primary-shadow {
    border-color: rgba(1, 49, 107, 0.2) !important
}
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
