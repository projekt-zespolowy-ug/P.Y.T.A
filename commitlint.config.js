module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': [2, 'always', 72],
		'type-enum': [
			2,
			'always',
			[
				'feat',
				'fix',
				'docs',
				'style',
				'refactor',
				'perf',
				'test',
				'chore',
				'build',
				'ci',
				'revert',
			],
		],
		'scope-enum': [2, 'always'],
		'scope-empty': [2, 'never'],
		'ticket-id': [2, 'always'],
	},
	plugins: [
		{
			rules: {
				'ticket-id': ({ header }) => {
					const ticketIdPattern = /\[(PYTA-\d+|NO-ISSUE)\]/;
					const isValid = ticketIdPattern.test(header);
					return [
						isValid,
						isValid ? null : 'Commit message must contain a ticket ID in the format [PYTA-1]',
					];
				},
			},
		},
	],
};
