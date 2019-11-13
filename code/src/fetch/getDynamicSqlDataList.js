import fetch from './_';

export default data => fetch(`/statisticsManage/getDynamicSqlDataList`, data).then(json => json);
