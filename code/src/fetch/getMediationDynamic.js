import fetch from './_';

export default data => fetch(`api/bigScreen/mediationDynamic`).then(json => json);
