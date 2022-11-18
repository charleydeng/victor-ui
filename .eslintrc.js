module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended', // 一些语法规则
    'plugin:vue/vue3-recommended', // 解析vue3语法 https://eslint.vuejs.org/
    'plugin:@typescript-eslint/recommended', // 解析ts 语法
    '@vue/typescript/recommended', // 校验 .vue 文件里的ts语法
    'plugin:prettier/recommended' //让`eslint`只负责代码质量检测而让`prettier`负责美化
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-contentnewline': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  globals: {
    // 声明一些全局变量
    defineProps: 'readonly',
    defineOptions: 'readonly'
  }
}
