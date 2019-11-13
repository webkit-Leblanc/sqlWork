import fetch from './_';

export default data => fetch(`/statisticsManage/getLogTableFields`, data).then(json => json);
