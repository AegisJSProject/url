import { node } from '@shgysk8zer0/eslint-config';

export default node({ files: ['**/*/js' ,'*.js'], ignores: ['**/*.min.js', '**/*.cjs', '**/*.mjs'] });
