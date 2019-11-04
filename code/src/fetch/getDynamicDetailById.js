import fetch from './_';

export default (id) => fetch(`api/bigScreen/dynamicDetail/${id}`).then(json => json);
