import child_process from 'child_process';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import * as net from 'net';
import path from 'path';

const shell = require('shelljs');
const term = require('term-launcher');
const inquirer = require('inquirer');

// 获取未占用端口
export const getUnusedPort = (port: number): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = net.createServer().listen(port);

    server.on('listening', () => {
      server.close(); // 关闭服务
      resolve(port);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getUnusedPort(port + 1));
      } else {
        reject(err);
      }
    });
  });

/** 获取可用端口 */
const getDemoPorts = async (
  demos: string[] = [],
  port = 9000,
  usedPorts: Record<string, number> = {}
): Promise<Record<string, number>> => {
  if (!demos.length) return usedPorts;

  const nextPort = await getUnusedPort(port);
  let ports = { ...usedPorts };

  const names = [...demos];
  const name = names.shift();

  ports = {
    ...usedPorts,
    [name as string]: nextPort,
  };

  ports = await getDemoPorts(names, nextPort + 1, ports);

  return ports;
};

function generateRoutesFile(folders: string[], ports: Record<string, number>) {
  const routes = folders.map(folder => {
    const pkgJson = JSON.parse(
      readFileSync(path.join(folder, 'package.json'), {
        encoding: 'utf8',
      })
    );
    const { name, nameZh } = pkgJson;
    return {
      name: nameZh,
      path: `/${name}`,
      port: ports[name],
    };
  });
  const fileContent = {
    routes,
  };
  writeFileSync(
    path.resolve('productions/home/routes.json'),
    JSON.stringify(fileContent, null, 2),
    { encoding: 'utf8' }
  );
}

async function selectDemos(
  choices: { value: string; name: string }[]
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const prompt = inquirer.createPromptModule();

    prompt([
      {
        type: 'checkbox',
        name: 'demos',
        message: 'start demos',
        pageSize: 15,
        choices,
      },
    ])
      .then((answers: { demos: string[] }) => {
        resolve(answers.demos);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

async function start(): Promise<any> {
  const choices = readdirSync(path.resolve('productions'))
    .filter(folder => folder !== 'home')
    .map(folder => {
      const pkgJson = JSON.parse(
        readFileSync(path.resolve(`productions/${folder}`, 'package.json'), {
          encoding: 'utf8',
        })
      );
      const { name, nameZh } = pkgJson;

      return {
        name: nameZh,
        value: name,
      };
    });

  const demos = await selectDemos(choices);

  const ports: Record<string, number> = await getDemoPorts(demos);

  generateRoutesFile(
    demos.map(demo => path.resolve(`productions/${demo}`)),
    ports
  );

  const commands = demos.map(folder => {
    const dir = path.resolve(`productions/${folder}`);

    return [
      `node ./node_modules/@xv-demo/engine/bin/index.js start --port ${ports[folder]}`,
      dir,
    ];
  });

  const shellDuration = 3000;

  const promises = commands.map((command, index) => {
    return new Promise(resolve => {
      setTimeout(() => {
        term.launchTerminal(...command);
        console.log(
          '[DEMO ENGINE]:',
          new Date().toLocaleString(),
          'Folder ' + command[1]
        );
        resolve(null);
      }, index * shellDuration);
    });
  });

  Promise.all(promises).then(() => {
    console.log('[DEMO ENGINE]:', 'Demos server are running');
    setTimeout(() => {
      shell.exec(`cd ${path.resolve('productions/home')} && npm run start`);
    }, shellDuration);
  });
}

export default start;
