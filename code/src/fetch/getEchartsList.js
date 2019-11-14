import fetch from './_';

export default data => fetch(`/statisticsManage/getEchartsList`, {}).then(json => json);
