const strAotu = `
%c凹凸实验室 AOTU Labs（aotu.io）

%c加入我们：%caotu@jd.com



%c哦对了，下方输入 %cplay %c看看首屏会发生什么 :)
`;

const strStopHint = `
%c凹凸魔力转圈圈，转累了输入 %cstop %c即可 :)
`;

const strAfterStop = `
%c海海人生，无折腾不为乐。

%c再次欢迎加入我们：%caotu@jd.com :)
`;

const style = {
  // n: 'color: #1c16df',
  n: 'font-size: 12px',
  // b: 'color: #1c16df; font-weight: bold',
  b: 'cfont-size: 12px; font-weight: bold',
};

const consoleAotu = (): void => {
  console.log(strAotu, style.b, style.n, style.b, style.n, style.b, style.n);
};

const consoleStopHint = (): void => {
  console.log(strStopHint, style.n, style.b, style.n);
};

const consoleAfterStop = (): void => {
  console.log(strAfterStop, style.b, style.n, style.b);
};

export { consoleAotu, consoleStopHint, consoleAfterStop };
