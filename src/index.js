const { createAtlassianClient } = require('./atlassian-client');
const { runPipeline, ROOT_PAGE_TITLE } = require('./pipeline');

async function main() {
  const atlassianClient = createAtlassianClient({
    baseUrl: process.env.ATLASSIAN_HOST,
    email: process.env.ATLASSIAN_EMAIL,
    apiToken: process.env.ATLASSIAN_API_TOKEN,
  });

  const client = {
    findPageByTitle: atlassianClient.findPageByTitle,
    createPage: atlassianClient.createPage,
    updatePage: atlassianClient.updatePage,
  };

  const result = await runPipeline({
    env: process.env,
    changedFiles: process.argv.slice(2),
    client,
    verifyResultsPath: process.env.VERIFY_RESULTS_PATH,
  });

  if (result.skipped) {
    console.log(result.reason);
    return;
  }

  console.log(`Completed sync for ${ROOT_PAGE_TITLE}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  main,
};