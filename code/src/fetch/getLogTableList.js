import fetch from './_';

export default data => fetch(`/statisticsManage/getLogTableList`, {}).then(json => json);
