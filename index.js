/**
 * Usage:
 * @color-classes $name, $color;
 */

module.exports = (opts = {}) => {
	return {
		postcssPlugin: 'postcss-color-classes',
		AtRule: {
			'color-classes': (atRule, api) => {
				colorPlugin(opts, atRule, api)
			},
		},
	}
}
module.exports.postcss = true

function colorPlugin(opts, atRule, { Rule, Declaration }) {
	let params = atRule.params
	if (params[0] === '(') {
		params = params.substr(1, params.length - 2)
	}
	const [name, color] = params.split(',').map((s) => s.trim())

	atRule.after(
		new Rule({ selector: `.color-${name}` }).append(
			new Declaration({
				prop: 'color',
				value: color + ' !important',
			})
		)
	)
	atRule.after(
		new Rule({ selector: `.bg-${name}` }).append(
			new Declaration({
				prop: 'background-color',
				value: color + ' !important',
			})
		)
	)
	atRule.after(
		new Rule({ selector: `.bd-${name}` }).append(
			new Declaration({
				prop: 'border-color',
				value: color + ' !important',
			})
		)
	)

	atRule.remove()
}
