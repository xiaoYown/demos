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
    const isPathToExist = fs.existsSync(folder);
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
        const dirLs = fs.readdirSync(pathFrom).map(file => ({
          name: file,
          isCopyed: false,
        }));
        dirLs.forEach(fileInfo => {
          const originPath = path.join(pathFrom, `./${fileInfo.name}`);
          const targetPath = path.join(pathTo, `./${fileInfo.name}`);

          if (/node_modules/.test(originPath)) return;

          if (fs.statSync(originPath).isDirectory()) {
            folderCopy(originPath, targetPath).then(() => {
              // eslint-disable-next-line no-param-reassign
              fileInfo.isCopyed = true;
              if (!dirLs.find(__file => !__file.isCopyed)) {
                resolve('');
              }
            });
          } else {
            // eslint-disable-next-line no-param-reassign
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

  pkgJson.name = `@demo-production/${name}`;
  pkgJson.nameZh = nameZh;

  writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2), {
    encoding: 'utf8',
  });
};

const isExistDemo = (name: string) =>
  isFolder(path.resolve(`productions/${name}`));

interface CreateInfoModel {
  name: string;
  nameZh: string;
}

const prepareCreateInfo = (): Promise<CreateInfoModel> =>
  new Promise((resolve, reject) => {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'demo name',
      },
      {
        type: 'input',
        name: 'nameZh',
        message: 'demo zh name',
      },
    ];

    const prompt = inquirer.createPromptModule();

    prompt(questions)
      .then((answers: CreateInfoModel) => {
        resolve(answers);
      })
      .catch((error: any) => {
        reject(error);
      });
  });

/* 校验填写 */
const validateCreateInfo = ({
  name,
  nameZh,
}: CreateInfoModel): Promise<{ status: 'ok' | 'fail'; message?: string }> =>
  new Promise((resolve, reject) => {
    if (!name || !nameZh) {
      reject(new Error('name/nameZh 字段必须填写'));
      return;
    }

    if (isExistDemo(name)) {
      reject(new Error('demo 已存在'));
      return;
    }

    resolve({ status: 'ok' });
  });

async function create(): Promise<any> {
  const createInfo = await prepareCreateInfo();
  const { status } = await validateCreateInfo(createInfo);
  const { name, nameZh } = createInfo;

  if (status !== 'ok') {
    return;
  }

  folderCopy(resolve('template'), resolve(`productions/${name}`));
  setTimeout(() => {
    rewritePackage(name, nameZh);
    shell.exec(`cd ${resolve(`productions/${name}`)} && pnpm install`);
  }, 2000);
}

export default create;
