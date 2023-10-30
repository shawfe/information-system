const fs = require("fs");

const F_1 = "configuration.dev.js";

const generateConfigurationFileContent = (
  backendUrl,
  backendPort,
  apiVersion,
  codeExecutionUrl,
  codeExecutionPort
) => `module.exports = {
  BACKEND_URL: "${backendUrl}",
  BACKEND_PORT: "${backendPort}",
  API_VERSION: "${apiVersion}",
  CODE_EXECUTION_URL: "${codeExecutionUrl}",
  CODE_EXECUTION_PORT: "${codeExecutionPort}"
};`;

try {
  const oldF1Data = fs.existsSync(F_1) && fs.readFileSync(F_1, 'utf8');
  const newF1Data = generateConfigurationFileContent('http://localhost', '3001', 'v1', 'http://localhost', '2358');

  if (oldF1Data && oldF1Data === newF1Data) {
    console.log(`File ${F_1} exists`);
  } else {
    console.log(`File ${F_1} is assigned`);
    fs.writeFileSync(
      F_1,
      newF1Data,
      'utf8'
    );
  }
} catch (err) {
  console.error(err);
}
