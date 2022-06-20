import fs, { readFileSync, statSync, writeFileSync } from 'fs';
import path, { resolve } from 'path';

const shell = require('shelljs');
const inquirer = require('inquirer');

const isFolder = (name: string): boolean => {
  try {
    const stats = statSync(name);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

function folderMk(folder: string) {
  return new Promise(resolve => {
    let isPathToExist = fs.existsSync(folder);
    if (!isPathToExist || !fs.statSync(folder).isDirectory()) {
      fs.mkdir(folder, resolve);
    } else {
      resolve('');
    }
  });
}

function folderCopy(pathFrom: string, pathTo: string): Promise<any> {
  return new Promise(resolve => {
    if (fs.existsSync(pathFrom) && fs.statSync(pathFrom).isDirectory()) {
      folderMk(pathTo).then(() => {
        let dirLs = fs.readdirSync(pathFrom).map(file => {
          return {
            name: file,
            isCopyed: false,
          };
        });
        dirLs.forEach(fileInfo => {
          let originPath = path.join(pathFrom, './' + fileInfo.name);
          let targetPath = path.join(pathTo, './' + fileInfo.name);

          if (/node_modules/.test(originPath)) return;

          if (fs.statSync(originPath).isDirectory()) {
            folderCopy(originPath, targetPath).then(() => {
              fileInfo.isCopyed = true;
              if (!dirLs.find(__file => !__file.isCopyed)) {
                resolve('');
              }
            });
          } else {
            fileInfo.isCopyed = true;
            fs.copyFile(originPath, targetPath, 1, () => {
              if (!dirLs.find(__file => !__file.isCopyed)) {
                resolve('');
              }
            });
          }
        });
      });
    }
  });
}

const rewritePackage = (name: string, nameZh: string) => {
  const pkgPath = resolve(`productions/${name}/package.json`);
  const pkgJson = JSON.parse(
    readFileSync(pkgPath, {
      encoding: 'utf8',
    }) as string
  );

  pkgJson.name = name;
  pkgJson.nameZh = nameZh;

  writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2), {
    encoding: 'utf8',
  });
};

const createDemoNameQuestion = (): Promise<{
  status: 'ok' | 'fail';
  message?: string;
  data: string;
}> => {
  const prompt = inquirer.createPromptModule();

  return new Promise((resolve, reject) => {
    prompt([
      {
        type: 'input',
        name: 'name',
        message: 'demo name',
      },
    ])
      .then((answers: { name: string }) => {
        if (!answers) {
          resolve({
            status: 'fail',
            message: 'Demo name is must!',
            data: '',
          });
          return;
        }
        if (isFolder(path.resolve(`productions/${answers.name}`))) {
          resolve({
            status: 'ok',
            message: `Demo ${answers.name} is exit.`,
            data: '',
          });
          return;
        }
        resolve({
          status: 'ok',
          data: answers.name,
        });
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

const createDemoNameZhQuestion = (): Promise<{
  status: 'ok' | 'fail';
  message?: string;
  data: string;
}> => {
  const prompt = inquirer.createPromptModule();

  return new Promise((resolve, reject) => {
    prompt([
      {
        type: 'input',
        name: 'name_zh',
        message: 'demo zh name',
      },
    ])
      .then((answers: { name_zh: string }) => {
        if (!answers) {
          resolve({
            status: 'fail',
            message: 'Demo zh name is must!',
            data: '',
          });
          return;
        }
        resolve({
          status: 'ok',
          data: answers.name_zh,
        });
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

async function create(): Promise<any> {
  let { data: name, status, message } = await createDemoNameQuestion();

  while (status === 'fail') {
    console.log('[DEMO ENGINE]:', message);
    let result = await createDemoNameQuestion();
    name = result.data;
    status = result.status;
    message = result.message;
  }

  let nameZh = '';
  let result = await createDemoNameZhQuestion();
  nameZh = result.data;
  status = result.status;
  message = result.message;

  while (status === 'fail') {
    console.log('[DEMO ENGINE]:', message);
    let result = await createDemoNameZhQuestion();
    nameZh = result.data;
    status = result.status;
    message = result.message;
  }

  folderCopy(resolve('packages/template'), resolve(`productions/${name}`));
  setTimeout(() => {
    console.log(typeof name, typeof nameZh);
    rewritePackage(name, nameZh);
    shell.exec(`cd ${resolve('productions/' + name)} && pnpm install`);
  }, 2000);
}

export default create;
