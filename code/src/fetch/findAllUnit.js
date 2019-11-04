import fetch from './_';

export default data => fetch(`api/bigScreen/findAllUnit`).then(json => json);
