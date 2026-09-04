/**
 * 声明 *.scss 副作用导入（side-effect import），避免 tsc 报
 * "Cannot find module ... canvas.scss"。
 */
declare module "*.scss";
