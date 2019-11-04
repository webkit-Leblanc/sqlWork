import fetch from './_';

export default data => fetch(`api/bigScreen/mediationRanking`).then(json => json);
