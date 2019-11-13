import fetch from './_';

export default data => fetch(`/statisticsManage/getDynamicSql`, data).then(json => json);
