import fetch from './_';

export default data =>
  fetch(`/statisticsManage/saveStatisticResult`, data).then(
    json => json
  );
