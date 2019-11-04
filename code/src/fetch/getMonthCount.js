import fetch from './_';

export default data => fetch(`api/bigScreen/monthCount`).then(json => json);
