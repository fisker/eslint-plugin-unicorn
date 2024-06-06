import eslintrc from '@eslint/eslintrc'

const {globals} = eslintrc.Legacy.environments.get('es2024');

export default {
	languageOptions: {
		globals,
	},
};
