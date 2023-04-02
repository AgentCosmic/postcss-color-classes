/**
 * Usage:
 * @generate-color <name> <color> [{
 *   <variation>: <tint(0-100)|shade(0-100)|alpha(0-1)|desaturate(0-100)|saturate(0-100)|no-color|no-bg|no-bd|no-var...>
 *   ...
 * }];
 */

const tinycolor = require('tinycolor2');

const defaults = {
	colorPrefix: 'color-',
	bgPrefix: 'bg-',
	borderPrefix: 'bd-',
	varPrefix: 'color-',
};

module.exports = (opts = {}) => {
	// set options with defaults
	for (const k in defaults) {
		if (!opts.hasOwnProperty(k)) {
			opts[k] = defaults[k];
		}
	}
	let varContainer;
	return {
		postcssPlugin: 'postcss-color-classes',
		Once(root, { Rule }) {
			varContainer = new Rule({ selector: ':root' });
			root.prepend(varContainer);
		},
		AtRule: {
			'generate-color': (atRule, api) => {
				colorPlugin(opts, atRule, varContainer, api);
			},
		},
	};
};
module.exports.postcss = true;

function colorPlugin(opts, atRule, varContainer, { Rule, result }) {
	// init variables
	const [name, color] = atRule.params.split(/\s+/);
	const c = tinycolor(color);

	function generateCode(color, postfix, disabled) {
		if (disabled.color !== false) {
			atRule.before(
				new Rule({ selector: `.${opts.colorPrefix}${name}${postfix}` }).append({
					prop: 'color',
					value: color,
					important: true,
				})
			);
		}
		if (disabled.bg !== false) {
			atRule.before(
				new Rule({ selector: `.${opts.bgPrefix}${name}${postfix}` }).append({
					prop: 'background-color',
					value: color,
					important: true,
				})
			);
		}
		if (disabled.border !== false) {
			atRule.before(
				new Rule({ selector: `.${opts.borderPrefix}${name}${postfix}` }).append({
					prop: 'border-color',
					value: color,
					important: true,
				})
			);
		}
		if (disabled.var !== false) {
			varContainer.append({ prop: `--${opts.varPrefix}${name}${postfix}`, value: color });
		}
	}

	// start generating code
	// for default color
	generateCode(c.toString(), '', {});
	// for variations
	atRule.walkDecls((decl) => {
		const disabled = {};
		let newColor = c;
		for (const [fn, amount] of parseArgs(decl.value)) {
			const v = Number(amount);
			if (fn === 'shade') {
				newColor = newColor.darken(v);
			} else if (fn === 'tint') {
				newColor = newColor.lighten(v);
			} else if (fn === 'alpha') {
				newColor = newColor.setAlpha(v);
			} else if (fn === 'desaturate') {
				newColor = newColor.desaturate(v);
			} else if (fn === 'saturate') {
				newColor = newColor.saturate(v);
			} else if (fn === 'no-color') {
				disabled.bg = false;
			} else if (fn === 'no-bg') {
				disabled.color = false;
			} else if (fn === 'no-bd') {
				disabled.border = false;
			} else if (fn === 'no-var') {
				disabled.var = false;
			} else {
				decl.warn(result, `Unrecognized property "${fn}"`);
			}
		}
		generateCode(newColor.toString(), '-' + decl.prop, disabled);
	});

	// cleanup
	atRule.remove();
}

function parseArgs(args) {
	return args.split(/\s+/).map((v) => v.match(/([a-z,\-\_]+)(?:\(([0-9\.]+)\))?/i).slice(1));
}

