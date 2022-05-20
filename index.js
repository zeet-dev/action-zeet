const github = require('@actions/github');
const tc = require('@actions/tool-cache');
const core = require('@actions/core');
const exec = require("@actions/exec")

const octokit = github.getOctokit(github.context.token)

async function getBinaryURL() {
  const res = await octokit.rest.repos.getLatestRelease({
    owner: "zeet-dev",
    repo: "cli",
  });

  let url;
  if (process.platform === "linux") {
    url = res.data.assets.find(a => a.name.includes("linux"));
  }
  if (process.platform === "win32") {
    url = res.data.assets.find(a => a.name.includes("windows"));
  }
  if (process.platform === "darwin") {
    url = res.data.asets.find(a => a.name.includes("darwin"));
  }

  return [url, res.data.tag_name];
}

async function downloadBinary(url) {
  const binaryPath = await tc.downloadTool(url)

  let extractedPath;
  if (url.endsWith(".tar.gz")) {
    extractedPath = await tc.extractTar(binaryPath)
  }
  if (url.endsWith(".zip")) {
    extractedPath = await tc.extractZip(binaryPath)
  }

  return extractedPath
}

async function run() {
  try {
    const [binaryURL, tagName] = await getBinaryURL();

    if (!tc.find("zeet", tagName)) {
      const binaryPath = await downloadBinary(binaryURL)
      const cachedPath = await tc.cacheDir(binaryPath, "zeet", tagName);
      core.addPath(cachedPath);
    }

    // Configure api url
    const apiURL = core.getInput('api_url', { required: true });
    await exec.exec('zeet', ['config:set', `server=${apiURL}`]);

    const token = core.getInput('token', { required: true });
    await exec.exec('zeet', ['login', `--token=${token}`, `--server=${apiURL}`]);

    core.info("Done!");
  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
