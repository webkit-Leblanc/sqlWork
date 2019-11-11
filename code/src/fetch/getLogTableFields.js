import fetch from './_';

export default data => fetch(`/statisticsManage/getLogTableFields`, {}).then(json => json);
