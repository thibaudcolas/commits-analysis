const _ = require('lodash');

const USER = 'ThibWeb';

const allRepos = require('./data/repositories.json');
const filteredRepos = _.filter(allRepos, { fork: false, private: false });

const getReposOf = username => _.filter(filteredRepos, { owner: { login: username } });

const ownRepos = getReposOf(USER);

const createFilename = repo => `${USER}-${repo.name}-commit_activity.json`;
const createFilepath = repo => `./data/commit-activity/${createFilename(repo)}`;

ownRepos.forEach((repo) => {
    const commitActivity = require(createFilepath(repo));

    repo.commitActivity = commitActivity;
    repo.totalActivity = commitActivity.reduce((sum, week) => sum + week.total, 0);
});

const totalActivity = ownRepos.reduce((sum, repo) => sum + repo.totalActivity, 0);

console.log('total', totalActivity);

const commitActivity = ownRepos.reduce((total, repo) => {
    repo.commitActivity.forEach((week) => {
        const weekTimestamp = (Math.floor(week.week / 500000) * 500000) * 1000;

        total[weekTimestamp] = (total[weekTimestamp] || 0) + week.total;
    });

    return total;
}, {});

const commitActivityArray = Object.keys(commitActivity).map((key) => {
    return {
        date: parseInt(key, 10),
        value: commitActivity[key],
    };
});

console.log(commitActivityArray);
console.log(commitActivityArray.reduce((sum, week) => sum + week.value, 0));
console.log(commitActivityArray.length);
