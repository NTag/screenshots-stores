import { exec as nodeExec } from "child_process";

export const exec = (command) => {
  return new Promise((resolve, reject) => {
    nodeExec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
};
