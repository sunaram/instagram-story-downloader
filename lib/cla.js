const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const getOptions = () => {
  const optionDefinitions = [
    { name: 'user', alias: 'u', type: String },
    { name: 'pass', alias: 'p', type: String },
    { name: 'input', alias: 'i', type: String },
    { name: 'time', alias: 't', type: Number },
    { name: 'help', alias: 'h', type: Boolean },
  ];
  const options = commandLineArgs(optionDefinitions)
  return options;
}
const printUsage = () => {
  const sections = [
    {
      header: 'Instagram story saver',
      content: 'Save stories from a list of users.'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'user',
          alias: 'u',
          typeLabel: '{underline username}',
          description: 'Instagram Username/Email.'
        },
        {
          name: 'pass',
          alias: 'p',
          typeLabel: '{underline password}',
          description: 'Instagram Password.'
        },
        {
          name: 'input',
          alias: 'i',
          typeLabel: '{underline file}',
          description: 'The input file containing the usernames to save stories from.'
        },

        {
          name: 'time',
          alias: 't',
          typeLabel: '{underline time}',
          description: 'Time duration in minutes, to wait before checking for new stories again.'
        },

        {
          name: 'help',
          alias: 'h',
          description: 'Print this usage guide.'
        }
      ]
    }
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
}

module.exports = {printUsage, getOptions}
