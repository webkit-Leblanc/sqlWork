import fetch from './_';

export default data => fetch(`api/bigScreen/mediationCount`).then(json => json);
