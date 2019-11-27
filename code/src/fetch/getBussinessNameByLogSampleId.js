import fetch from './_';

export default data =>
  fetch(`/statisticsManage/getBusinessNameByLogSampleId`, data).then(
    json => json
  );
