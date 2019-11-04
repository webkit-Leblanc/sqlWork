import fetch from './_';

export default data => fetch(`api/bigScreen/caseReasonRate`).then(json => json);
