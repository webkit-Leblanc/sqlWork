import fetch from './_';

export default data => fetch(`api/bigScreen/mediationRate`).then(json => json);
